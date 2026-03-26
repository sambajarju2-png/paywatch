import { ImageResponse } from 'next/og';
import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: 'pwf6qbjc',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export const runtime = 'edge';
export const alt = 'PayWatch Blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch blog post from Sanity
  let title = 'PayWatch Blog';
  let category = '';
  let imageUrl = '';

  try {
    const post = await sanity.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]{
        "title": title.nl,
        "category": category->title,
        "imageUrl": mainImage.asset->url
      }`,
      { slug }
    );

    if (post) {
      title = post.title || title;
      category = post.category || '';
      imageUrl = post.imageUrl || '';
    }
  } catch {
    // Use defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background image or gradient */}
        {imageUrl ? (
          <img
            src={`${imageUrl}?w=1200&h=630&fit=crop`}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : null}

        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: imageUrl
              ? 'linear-gradient(180deg, rgba(10,37,64,0.7) 0%, rgba(10,37,64,0.95) 100%)'
              : 'linear-gradient(135deg, #0A2540 0%, #1a3a5c 50%, #0A2540 100%)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '48px 56px',
          }}
        >
          {/* Top bar: Logo + Category */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {/* PayWatch logo mark */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                P
              </div>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '-0.5px',
                }}
              >
                PayWatch
              </span>
            </div>

            {category ? (
              <div
                style={{
                  background: 'rgba(59,130,246,0.25)',
                  border: '1px solid rgba(59,130,246,0.5)',
                  borderRadius: '20px',
                  padding: '6px 18px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#93C5FD',
                }}
              >
                {category}
              </div>
            ) : null}
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 50 ? '40px' : '48px',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.2,
                letterSpacing: '-1px',
                margin: 0,
                maxWidth: '900px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255,255,255,0.6)',
                margin: 0,
              }}
            >
              paywatch.app/blog
            </p>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Grip op je rekeningen
            </span>
            <div
              style={{
                display: 'flex',
                gap: '24px',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              <span>43+ Gemeenten</span>
              <span>100% Gratis</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
