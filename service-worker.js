// Basic Service Worker for Kitty Jetpack! Nyaa~!

const CACHE_NAME = 'kitty-jetpack-cache-v1';

// Add all essential files your game needs to run offline

const urlsToCache = [

  '/', // The base URL (often index.html)

  'index.html',

  'sketch.js',

  'style.css', // If you have one (p5 editor usually does)

  // Add the ACTUAL paths to your p5.js libraries! Check your index.html

  // Example paths (might be different for you!):

  'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js', // Or just 'p5.js' if local

  'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min.js', // Or 'p5.sound.min.js'

  // Add your game assets!

  'Skyward Whiskers.mp3',

  'Skybound Quest.mp3',

  'icon-192.png',

  'icon-512.png'

  // Add any other images/fonts if you use them!

];

// Install event: Cache essential files

self.addEventListener('install', event => {

  console.log('Service Worker: Installing... Nyaa~');

  event.waitUntil(

    caches.open(CACHE_NAME)

      .then(cache => {

        console.log('Service Worker: Caching app shell...');

        return cache.addAll(urlsToCache);

      })

      .catch(error => {

        console.error('Service Worker: Failed to cache app shell:', error);

      })

  );

});

// Activate event: Clean up old caches (optional but good practice)

self.addEventListener('activate', event => {

  console.log('Service Worker: Activating... Purrrr!');

  event.waitUntil(

    caches.keys().then(cacheNames => {

      return Promise.all(

        cacheNames.filter(cacheName => {

          // Delete caches that are not the current one

          return cacheName.startsWith('kitty-jetpack-cache-') && cacheName !== CACHE_NAME;

        }).map(cacheName => {

          console.log('Service Worker: Deleting old cache:', cacheName);

          return caches.delete(cacheName);

        })

      );

    })

  );

  return self.clients.claim(); // Take control immediately

});

// Fetch event: Serve cached files when offline

self.addEventListener('fetch', event => {

  // console.log('Service Worker: Fetching', event.request.url);

  event.respondWith(

    caches.match(event.request)

      .then(response => {

        // Return cached response if found, otherwise fetch from network

        return response || fetch(event.request);

      })

      .catch(error => {

          console.error('Service Worker: Fetch failed:', error);

          // Maybe return a fallback page here if you have one?

      })

  );

});