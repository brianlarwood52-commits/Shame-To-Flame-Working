import withPWA from '@ducanh2912/next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export for VentraIP deployment
  images: {
    unoptimized: true,
  },
  turbopack: {},
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  sw: 'sw.js',
  buildExcludes: [/middleware-manifest\.json$/],

  runtimeCaching: [
    // Next.js build assets
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/_next/static/'),
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static',
        expiration: {
          maxEntries: 256,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },

    // Images
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 256,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },

    // Navigations (pages) for offline reading
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 128,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
      },
    },

    // JSON / API responses
    {
      urlPattern: ({ request }) =>
        request.destination === '' &&
        (request.headers.get('accept') || '').includes('application/json'),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'api-json',
        expiration: {
          maxEntries: 128,
          maxAgeSeconds: 60 * 60 * 24,
        },
      },
    },
  ],
})(nextConfig)
