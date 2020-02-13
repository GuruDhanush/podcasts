importScripts('workbox-v4.3.1/workbox-sw.js');

// import { registerRoute } from 'workbox-routing';
// import {  NetworkFirst, CacheFirst, StaleWhileRevalidate} from 'workbox-strategies';
// import { ExpirationPlugin } from 'workbox-expiration';
// import { precacheAndRoute } from 'workbox-precaching';
// import workbox from 'workbox-sw';


let strategies = self.workbox.strategies;
let routing = self.workbox.routing;

 
routing.registerRoute(
  /\.js$/,
  new strategies.NetworkFirst()
);

routing.registerRoute(
  /\.css$/,
  // Use cache but update in the background.
  new strategies.StaleWhileRevalidate({
    cacheName: 'css-cache',
  })
);

routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  // Use the cache if it's available.
  new strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      {
        // Cache only 20 images.
        maxEntries: 20,
        // Cache for a maximum of a week.
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }
    ],
  })
);

routing.registerRoute(
  /.*\.mp3/,
  // Use the cache if it's available.
  new strategies.CacheFirst({
    cacheName: 'audio-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({statuses: [200]}),
      new workbox.rangeRequests.Plugin()
    ]
  })
);

// workbox.routing.registerRoute(
//   /.*\.mp3/,
//   new workbox.strategies.CacheOnly({
//     cacheName: workbox.core.cacheNames.precache,
//     plugins: [
//       new workbox.rangeRequests.Plugin(),
//     ],
//     // This is needed since precached resources may
//     // have a ?_WB_REVISION=... URL param.
//     matchOptions: {
//       ignoreSearch: true,
//     }
//   }),
//);



workbox.precaching.precacheAndRoute([]);
