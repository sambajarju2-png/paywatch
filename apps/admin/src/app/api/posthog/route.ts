import { NextRequest, NextResponse } from 'next/server';

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '';
const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY || '';

async function phQuery(query: string): Promise<{ results: unknown[][]; columns: string[] }> {
  if (!POSTHOG_API_KEY || !POSTHOG_PROJECT_ID) {
    return { results: [], columns: [] };
  }

  try {
    const res = await fetch(
      `${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${POSTHOG_API_KEY}`,
        },
        body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
      }
    );

    if (!res.ok) {
      console.error('[PostHog] Query failed:', res.status, await res.text().catch(() => ''));
      return { results: [], columns: [] };
    }

    return res.json();
  } catch (err) {
    console.error('[PostHog] Query error:', err);
    return { results: [], columns: [] };
  }
}

export async function GET(req: NextRequest) {
  const days = parseInt(req.nextUrl.searchParams.get('days') || '30');
  const interval = `interval ${days} day`;

  // Run all queries in parallel
  const [
    overviewRes,
    dailyRes,
    topPagesRes,
    referrersRes,
    countriesRes,
    browsersRes,
    devicesRes,
    osRes,
    bounceRes,
    heatmapRes,
    entryPagesRes,
    exitPagesRes,
    utmRes,
  ] = await Promise.all([
    // 1. Overview metrics
    phQuery(`
      SELECT
        count() as total_pageviews,
        count(DISTINCT person_id) as unique_visitors,
        count(DISTINCT properties.$session_id) as total_sessions
      FROM events
      WHERE event = '$pageview' AND timestamp > now() - ${interval}
    `),

    // 2. Daily traffic
    phQuery(`
      SELECT
        toDate(timestamp) as day,
        count() as pageviews,
        count(DISTINCT person_id) as visitors
      FROM events
      WHERE event = '$pageview' AND timestamp > now() - ${interval}
      GROUP BY day ORDER BY day
    `),

    // 3. Top pages
    phQuery(`
      SELECT
        replaceRegexpAll(properties.$pathname, '\\\\?.*', '') as page,
        count() as views,
        count(DISTINCT person_id) as unique_views
      FROM events
      WHERE event = '$pageview' AND timestamp > now() - ${interval}
      GROUP BY page ORDER BY views DESC LIMIT 20
    `),

    // 4. Referrers
    phQuery(`
      SELECT
        if(properties.$referrer = '' OR properties.$referrer IS NULL, '(direct)',
          domain(properties.$referrer)) as referrer,
        count() as visits,
        count(DISTINCT person_id) as unique_visits
      FROM events
      WHERE event = '$pageview' AND timestamp > now() - ${interval}
      GROUP BY referrer ORDER BY visits DESC LIMIT 15
    `),

    // 5. Countries
    phQuery(`
      SELECT
        properties.$geoip_country_code as country,
        properties.$geoip_country_name as country_name,
        count(DISTINCT person_id) as visitors
      FROM events
      WHERE event = '$pageview' AND timestamp > now() - ${interval}
        AND properties.$geoip_country_code IS NOT NULL
      GROUP BY country, country_name ORDER BY visitors DESC LIMIT 15
    `),

    // 6. Browsers
    phQuery(`
      SELECT
        properties.$browser as browser,
        count(DISTINCT person_id) as users
      FROM events
      WHERE event = '$pageview' AND timestamp > now() - ${interval}
        AND properties.$browser IS NOT NULL
      GROUP BY browser ORDER BY users DESC LIMIT 10
    `),

    // 7. Devices
    phQuery(`
      SELECT
        properties.$device_type as device,
        count(DISTINCT person_id) as users
      FROM events
      WHERE event = '$pageview' AND timestamp > now() - ${interval}
        AND properties.$device_type IS NOT NULL
      GROUP BY device ORDER BY users DESC
    `),

    // 8. OS
    phQuery(`
      SELECT
        properties.$os as os,
        count(DISTINCT person_id) as users
      FROM events
      WHERE event = '$pageview' AND timestamp > now() - ${interval}
        AND properties.$os IS NOT NULL
      GROUP BY os ORDER BY users DESC LIMIT 10
    `),

    // 9. Bounce rate + avg duration + pages/session
    phQuery(`
      SELECT
        countIf(pages = 1) as bounced,
        count() as total,
        avg(duration) as avg_duration,
        avg(pages) as avg_pages
      FROM (
        SELECT
          properties.$session_id as sid,
          count() as pages,
          dateDiff('second', min(timestamp), max(timestamp)) as duration
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval}
          AND properties.$session_id IS NOT NULL
        GROUP BY sid
      )
    `),

    // 10. Activity heatmap
    phQuery(`
      SELECT
        toDayOfWeek(timestamp) as dow,
        toHour(timestamp) as hour,
        count() as views
      FROM events
      WHERE event = '$pageview' AND timestamp > now() - ${interval}
      GROUP BY dow, hour ORDER BY dow, hour
    `),

    // 11. Entry pages
    phQuery(`
      SELECT page, count() as entries FROM (
        SELECT
          properties.$session_id as sid,
          first_value(replaceRegexpAll(properties.$pathname, '\\\\?.*', '')) as page
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval}
          AND properties.$session_id IS NOT NULL
        GROUP BY sid
      ) GROUP BY page ORDER BY entries DESC LIMIT 10
    `),

    // 12. Exit pages
    phQuery(`
      SELECT page, count() as exits FROM (
        SELECT
          properties.$session_id as sid,
          last_value(replaceRegexpAll(properties.$pathname, '\\\\?.*', '')) as page
        FROM events
        WHERE event = '$pageview' AND timestamp > now() - ${interval}
          AND properties.$session_id IS NOT NULL
        GROUP BY sid
      ) GROUP BY page ORDER BY exits DESC LIMIT 10
    `),

    // 13. UTM
    phQuery(`
      SELECT
        properties.utm_source as source,
        properties.utm_medium as medium,
        properties.utm_campaign as campaign,
        count(DISTINCT person_id) as visitors
      FROM events
      WHERE event = '$pageview' AND timestamp > now() - ${interval}
        AND properties.utm_source IS NOT NULL
      GROUP BY source, medium, campaign ORDER BY visitors DESC LIMIT 15
    `),
  ]);

  // Parse results
  const overview = overviewRes.results[0] || [0, 0, 0];
  const bounce = bounceRes.results[0] || [0, 1, 0, 1];
  const bounceRate = Number(bounce[1]) > 0 ? Math.round((Number(bounce[0]) / Number(bounce[1])) * 100) : 0;

  return NextResponse.json({
    overview: {
      pageviews: Number(overview[0]),
      visitors: Number(overview[1]),
      sessions: Number(overview[2]),
      bounceRate,
      avgDuration: Math.round(Number(bounce[2]) || 0),
      pagesPerSession: Number(Number(bounce[3] || 1).toFixed(1)),
    },
    daily: dailyRes.results.map(r => ({
      day: String(r[0]),
      pageviews: Number(r[1]),
      visitors: Number(r[2]),
    })),
    topPages: topPagesRes.results.map(r => ({
      page: String(r[0]),
      views: Number(r[1]),
      unique: Number(r[2]),
    })),
    referrers: referrersRes.results.map(r => ({
      referrer: String(r[0]),
      visits: Number(r[1]),
      unique: Number(r[2]),
    })),
    countries: countriesRes.results.map(r => ({
      code: String(r[0]),
      name: String(r[1]),
      visitors: Number(r[2]),
    })),
    browsers: browsersRes.results.map(r => ({
      browser: String(r[0]),
      users: Number(r[1]),
    })),
    devices: devicesRes.results.map(r => ({
      device: String(r[0]),
      users: Number(r[1]),
    })),
    os: osRes.results.map(r => ({
      os: String(r[0]),
      users: Number(r[1]),
    })),
    heatmap: heatmapRes.results.map(r => ({
      dow: Number(r[0]),
      hour: Number(r[1]),
      views: Number(r[2]),
    })),
    entryPages: entryPagesRes.results.map(r => ({
      page: String(r[0]),
      entries: Number(r[1]),
    })),
    exitPages: exitPagesRes.results.map(r => ({
      page: String(r[0]),
      exits: Number(r[1]),
    })),
    utm: utmRes.results.map(r => ({
      source: String(r[0]),
      medium: String(r[1]),
      campaign: String(r[2]),
      visitors: Number(r[3]),
    })),
    days,
  }, {
    headers: { 'Cache-Control': 'private, max-age=300' }, // 5 min cache
  });
}
