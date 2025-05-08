"use client"

import { useEffect } from "react"

interface StructuredDataProps {
  type: "Organization" | "Product" | "Article" | "FAQPage" | "WebSite" | "NGO" | "MedicalWebPage"
  data: Record<string, any>
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    // Create the script element
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": type,
      ...data,
    })

    // Add it to the document head
    document.head.appendChild(script)

    // Clean up on unmount
    return () => {
      document.head.removeChild(script)
    }
  }, [type, data])

  // This component doesn't render anything
  return null
}
