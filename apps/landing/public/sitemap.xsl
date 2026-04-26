<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="nl">
<head>
  <title>Sitemap — PayWatch</title>
  <meta name="robots" content="noindex,follow"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: #f8fafc; color: #1e293b; line-height: 1.5; }
    .header { background: #0f172a; color: white; padding: 32px 24px; }
    .header h1 { font-size: 24px; font-weight: 800; margin-bottom: 4px; }
    .header p { font-size: 13px; color: #94a3b8; }
    .header a { color: #60a5fa; text-decoration: none; }
    .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .stats { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; flex: 1; min-width: 140px; }
    .stat-value { font-size: 28px; font-weight: 800; color: #2563eb; }
    .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    th { background: #f1f5f9; text-align: left; padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; border-bottom: 1px solid #e2e8f0; }
    td { padding: 10px 16px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
    tr:hover td { background: #f8fafc; }
    td a { color: #2563eb; text-decoration: none; font-weight: 500; }
    td a:hover { text-decoration: underline; }
    .priority { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
    .p-high { background: #dcfce7; color: #166534; }
    .p-med { background: #dbeafe; color: #1e40af; }
    .p-low { background: #f1f5f9; color: #64748b; }
    .freq { font-size: 12px; color: #94a3b8; }
    .lang { display: inline-flex; gap: 4px; }
    .lang span { font-size: 10px; background: #f1f5f9; padding: 1px 6px; border-radius: 4px; color: #64748b; font-weight: 600; }
    @media (max-width: 768px) {
      .container { padding: 12px; }
      th:nth-child(3), td:nth-child(3), th:nth-child(4), td:nth-child(4), th:nth-child(5), td:nth-child(5) { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="max-width:1200px;margin:0 auto">
      <h1>PayWatch Sitemap</h1>
      <p>
        Gegenereerd op <xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/> ·
        <a href="https://paywatch.app">paywatch.app</a>
      </p>
    </div>
  </div>
  <div class="container">
    <div class="stats">
      <div class="stat">
        <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
        <div class="stat-label">Pagina's</div>
      </div>
      <div class="stat">
        <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url[contains(sitemap:loc,'/blog/')])"/></div>
        <div class="stat-label">Blog posts</div>
      </div>
      <div class="stat">
        <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url[contains(sitemap:loc,'/vergelijking/')])"/></div>
        <div class="stat-label">Vergelijkingen</div>
      </div>
      <div class="stat">
        <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url[contains(sitemap:loc,'/schuldhulp/')])"/></div>
        <div class="stat-label">Gemeenten</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:3%">#</th>
          <th>URL</th>
          <th style="width:12%">Laatst gewijzigd</th>
          <th style="width:10%">Frequentie</th>
          <th style="width:8%">Prioriteit</th>
          <th style="width:8%">Talen</th>
        </tr>
      </thead>
      <tbody>
        <xsl:for-each select="sitemap:urlset/sitemap:url">
          <tr>
            <td style="color:#94a3b8;font-size:11px"><xsl:value-of select="position()"/></td>
            <td>
              <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
            </td>
            <td style="font-size:12px;color:#64748b"><xsl:value-of select="sitemap:lastmod"/></td>
            <td><span class="freq"><xsl:value-of select="sitemap:changefreq"/></span></td>
            <td>
              <xsl:choose>
                <xsl:when test="sitemap:priority &gt;= 0.8">
                  <span class="priority p-high"><xsl:value-of select="sitemap:priority"/></span>
                </xsl:when>
                <xsl:when test="sitemap:priority &gt;= 0.6">
                  <span class="priority p-med"><xsl:value-of select="sitemap:priority"/></span>
                </xsl:when>
                <xsl:otherwise>
                  <span class="priority p-low"><xsl:value-of select="sitemap:priority"/></span>
                </xsl:otherwise>
              </xsl:choose>
            </td>
            <td>
              <xsl:if test="xhtml:link">
                <div class="lang">
                  <xsl:for-each select="xhtml:link">
                    <span><xsl:value-of select="@hreflang"/></span>
                  </xsl:for-each>
                </div>
              </xsl:if>
            </td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
