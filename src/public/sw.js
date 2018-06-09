importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
    workbox.routing.registerRoute(
        /\.(?:js|css|png|gif|jpg|jpeg|svg|html|mp4|pdf)$/,
        workbox.strategies.cacheFirst({
            cacheName: 'main',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                })
            ]
        })
    );
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}