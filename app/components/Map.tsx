"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const Map = () => {
  const mapRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const map = L.map(mapRef.current).setView([51.505, -0.09], 13)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Add markers for nearby users (example data)
      const nearbyUsers = [
        { lat: 51.505, lng: -0.09, name: "User 1" },
        { lat: 51.51, lng: -0.1, name: "User 2" },
        { lat: 51.515, lng: -0.095, name: "User 3" },
      ]

      nearbyUsers.forEach((user) => {
        L.marker([user.lat, user.lng]).addTo(map).bindPopup(user.name)
      })

      return () => {
        map.remove()
      }
    }
  }, [])

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
}

export default Map
