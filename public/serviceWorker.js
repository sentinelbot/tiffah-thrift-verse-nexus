
const CACHE_NAME = 'tiffah-cache-v1';
const OFFLINE_URL = '/offline.html';
const FALLBACK_IMAGE = '/placeholder.svg';

// Resources to precache
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/placeholder.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/sounds/beep.mp3',
  '/src/index.css',
  '/src/styles/animations.css'
];

// Install event - precache resources
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline resources');
      return cache.addAll(PRECACHE_RESOURCES);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For navigation requests, try network first with cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // For API requests
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('supabase.co')) {
    
    // For GET requests, use stale-while-revalidate
    if (event.request.method === 'GET') {
      event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
          const cachedResponse = await cache.match(event.request);
          
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch((error) => {
              console.log('[ServiceWorker] Fetch failed: ', error);
              // Return cached response or offline response
              return cachedResponse || new Response(
                JSON.stringify({ error: 'You are offline' }), 
                { 
                  headers: { 'Content-Type': 'application/json' },
                  status: 503
                }
              );
            });
          
          return cachedResponse || fetchPromise;
        })
      );
    } else {
      // For non-GET requests (POST, PUT, DELETE), use Background Sync if offline
      if (!navigator.onLine) {
        event.respondWith(
          new Response(
            JSON.stringify({ 
              error: 'You are offline, but your request has been queued for sync' 
            }), 
            { 
              headers: { 'Content-Type': 'application/json' },
              status: 503
            }
          )
        );
        
        // Register for sync
        event.waitUntil(
          self.registration.sync.register('sync-requests')
        );
      }
    }
    return;
  }

  // For image requests, use cache-first for images
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Try to fetch the image
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              // Add to cache if response is valid
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Return placeholder for failed image requests
            return caches.match(FALLBACK_IMAGE);
          });
      })
    );
    return;
  }

  // For all other requests, use stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok && !event.request.url.includes('chrome-extension')) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch((error) => {
          console.log('[ServiceWorker] Fetch failed: ', error);
          return cachedResponse || new Response('Network error');
        });
      
      return cachedResponse || fetchPromise;
    })
  );
});

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-requests') {
    event.waitUntil(
      self.indexedDB.sync.getPendingRequests()
        .then((requests) => {
          return Promise.all(
            requests.map((request) => {
              return fetch(request.url, {
                method: request.method,
                headers: request.headers,
                body: request.body
              });
            })
          );
        })
        .then(() => {
          return self.indexedDB.sync.clearPendingRequests();
        })
    );
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      data: data.url ? { url: data.url } : {}
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
