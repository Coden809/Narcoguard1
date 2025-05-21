export default function favicon() {
  return [
    {
      rel: "icon",
      url: "/favicon.ico",
      sizes: "any",
    },
    {
      rel: "icon",
      url: "/icons/icon-16x16.png",
      sizes: "16x16",
      type: "image/png",
    },
    {
      rel: "icon",
      url: "/icons/icon-32x32.png",
      sizes: "32x32",
      type: "image/png",
    },
    {
      rel: "apple-touch-icon",
      url: "/icons/apple-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  ]
}
