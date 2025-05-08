import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Narcoguard - Life-Saving Innovation",
    short_name: "Narcoguard",
    description:
      "A revolutionary app designed to prevent opioid overdose deaths through real-time monitoring, community response, and cutting-edge technology.",
    start_url: "/",
    display: "standalone",
    background_color: "#1F2937",
    theme_color: "#6366F1",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
