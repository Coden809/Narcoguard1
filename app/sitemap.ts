import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://narcoguard.com"

  // Base routes
  const routes = [
    "",
    "/about",
    "/how-it-works",
    "/hero-network",
    "/resources",
    "/contact",
    "/download",
    "/download/ios",
    "/download/android",
    "/download/windows",
    "/download/mac",
    "/download/linux",
    "/download/web",
    "/app",
    "/dashboard",
    "/donate",
    "/grants",
    "/privacy",
    "/terms",
    "/accessibility",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }))

  return routes
}
