/**
 * ============================================
 * THAILAND BOOK NUMBERS - OVERSEAS
 * Service Worker for PWA/Offline Support
 * ============================================
 */

const CACHE_NAME = 'thailand-books-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/js/config.js',
    '/assets/js/app.js',
    '/assets/js/modules/storage.js',
    '/assets/js/modules/language.js',
    '/assets/js/modules/currency.js',
    '/assets/js/modules/bidEngine.js',
    '/assets/js/modules/whatsapp.js',
    '/assets/js/modules/uiRenderer.js',
    '/manifest.json',
    '/assets/images/icon-192x192.png',
    '/assets/images/icon-512x512.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching assets...');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys.filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension requests
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response;
                }
                
                // Otherwise fetch from network
                return fetch(event.request)
                    .then(networkResponse => {
                        // Don't cache non-success responses
                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }
                        
                        // Cache the fetched response
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return networkResponse;
                    })
                    .catch(() => {
                        // Fallback for offline
                        if (event.request.url.includes('/')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});