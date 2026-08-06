import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout', '/cart', '/profile', '/orders', '/order', '/refund', '/redeem'],
      },
    ],
    sitemap: 'https://www.khatifamily.com/sitemap.xml',
  }
}
