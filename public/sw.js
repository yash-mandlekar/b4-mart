self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
   
    event.waitUntil(
        caches.open('static-cache').then((cache) => {
            console.log('Caching App Shell');
            return cache.addAll([
                '/',
                '/@vite/client',
                '/public/icons/vite.svg',
                '/src/index.css',
                '/public/manifest.webmanifest',
                '/src/index.html',
                '/src/component/login.css',
                '/src/component/login.jsx',
                '/src/component/signup.css',
                '/src/component/signup.jsx',
                '/src/app.css',
                '/src/app.jsx',
                '/src/main.jsx',
                '/@react-refresh',
                '/node_modules/vite/dist/client/env.mjs',
            ]);
        })
    );
});


self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
   
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== 'static-cache') {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});


self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching', event.request.url);
  
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => caches.match('/main.jsx'));
        })
    );
});