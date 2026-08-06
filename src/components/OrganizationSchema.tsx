import Script from 'next/script'

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Khati Family",
    "alternateName": "Khati Family Spices",
    "url": "https://www.khatifamily.com",
    "logo": "https://www.khatifamily.com/logo.png",
    "description": "Authentic masalas and premium dry foods sourced directly from certified farms, lab-tested for purity, and delivered fresh to your kitchen.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BD",
      "addressRegion": "Dhaka"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+880-1700-000000",
      "contactType": "customer service",
      "email": "support@khatifamily.com",
      "availableLanguage": ["en", "bn"]
    },
    "sameAs": [
      "https://www.facebook.com/khatifamily",
      "https://www.instagram.com/khatifamily"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2400"
    }
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
