import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/account',
        '/create',
        '/forgot-password',
        '/login',
        '/register',
        '/reset-password',
        '/verify-email',
        '/resend-verification',
      ],
    },
    sitemap: baseUrl ? `${baseUrl}/sitemap.xml` : undefined,
  }
}
