// Service Worker for Narcoguard Progressive Web App

const CACHE_NAME = "narcoguard-v1"
const OFFLINE_URL = "/offline"

// Resources to cache on install
const STATIC_RESOURCES = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/globals.css",
  // Add other important static assets
]

// Install event - cache basic static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_RESOURCES)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME
            })
            .map((cacheName) => {
              return caches.delete(cacheName)
            }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - network first, fallback to cache, offline page as last resort
self.addEventListener("fetch", (event) => {
  // Exclude non-GET requests and API calls
  if (event.request.method !== "GET" || event.request.url.includes("/api/")) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for future offline use
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Return from cache if available
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          // Return offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL)
          }

          // Return a placeholder for images
          if (event.request.destination === "image") {
            return new Response(
              '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#eee"/><text x="200" y="150" text-anchor="middle" fill="#999">Image Offline</text></svg>',
              {
                headers: {
                  "Content-Type": "image/svg+xml",
                },
              },
            )
          }

          return new Response("Content unavailable offline", {
            status: 503,
            statusText: "Service Unavailable",
          })
        })
      }),
  )
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "emergency-contact-sync") {
    event.waitUntil(syncEmergencyContacts())
  } else if (event.tag === "health-data-sync") {
    event.waitUntil(syncHealthData())
  }
})

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data.json()

  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-96x96.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
    actions: [
      {
        action: "open",
        title: "Open App",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title || "Narcoguard Update", options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "open" || event.action === "") {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        // If a tab is open, focus it
        for (const client of windowClients) {
          if (client.url === event.notification.data.url && "focus" in client) {
            return client.focus()
          }
        }

        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url)
        }
      }),
    )
  }
})

// Helper functions for background sync
async function syncEmergencyContacts() {
  const contactsQueue = await getQueuedContacts()

  try {
    for (const contact of contactsQueue) {
      await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      })
    }
    await clearQueuedContacts()
  } catch (error) {
    console.error("Failed to sync emergency contacts:", error)
  }
}

async function syncHealthData() {
  const healthDataQueue = await getQueuedHealthData()

  try {
    for (const data of healthDataQueue) {
      await fetch("/api/health-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    }
    await clearQueuedHealthData()
  } catch (error) {
    console.error("Failed to sync health data:", error)
  }
}

// These would be implemented using IndexedDB in a real app
async function getQueuedContacts() {
  // Placeholder for IndexedDB implementation
  return []
}

async function clearQueuedContacts() {
  // Placeholder for IndexedDB implementation
}

async function getQueuedHealthData() {
  // Placeholder for IndexedDB implementation
  return []
}

async function clearQueuedHealthData() {
  // Placeholder for IndexedDB implementation
}
