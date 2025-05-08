import Head from "next/head"

interface MetaTagsProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: "summary" | "summary_large_image" | "app" | "player"
}

export default function MetaTags({
  title = "Narcoguard - Overdose Prevention Technology",
  description = "Narcoguard uses advanced technology to detect and prevent overdose deaths through real-time monitoring and emergency response.",
  keywords = "overdose prevention, narcan, naloxone, opioid crisis, harm reduction, health technology, smartwatch",
  ogImage = "/og-image.jpg",
  ogUrl = "https://narcoguard.com",
  twitterCard = "summary_large_image",
}: MetaTagsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://narcoguard.com"
  const fullOgImageUrl = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImageUrl} />

      {/* Additional Meta Tags */}
      <meta name="application-name" content="Narcoguard" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Narcoguard" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#6366F1" />
    </Head>
  )
}
