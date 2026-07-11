const CACHE_NAME = "boutique-reves-v3";
const STATIC_CACHE = "boutique-reves-static-v3";
const DYNAMIC_CACHE = "boutique-reves-dynamic-v3";

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/BR-01.png",
  "/BR-01.png",
  "/BR-01.png",
  "/BR-01.png",
  "/BR-01.png",
  "/BR-01.png",
  "/BR-01.png",
  "/BR-01.png",
  "/BR-01.png",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("Failed to cache some static assets:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith("http")) return;

  // For navigation requests (HTML pages) - network first
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match("/");
          });
        })
    );
    return;
  }

  // For static assets (JS, CSS, images) - cache first
  if (
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".ttf")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // For API requests (Supabase) - network first, DO NOT cache
  if (url.hostname.includes("supabase")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Don't cache Supabase responses
          return response;
        })
        .catch(() => {
          return new Response(JSON.stringify({ error: "offline" }), {
            headers: { "Content-Type": "application/json" },
          });
        })
    );
    return;
  }

  // For other dynamic content - network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle push notifications (optional future use)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title || "L'impératrice", {
        body: data.body || "Nouvelle notification",
        icon: "/BR-01.png",
        badge: "/BR-01.png",
        vibrate: [100, 50, 100],
        data: data.url || "/",
      })
    );
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || "/")
  );
});