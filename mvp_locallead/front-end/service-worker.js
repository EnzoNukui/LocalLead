const CACHE_NAME = "locallead-cache-v6";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./linha.html",
    "./manifest.json",

    "./css/global.css",
    "./css/menu.css",
    "./css/home.css",
    "./css/linha.css",
    "./css/vagoes.css",

    "./js/api.js",
    "./js/home.js",
    "./js/linha.js",

    "./assets/icon/favicon.ico",
    "./assets/images/logo_locallead.png",
    "./assets/images/imagem_trem_luz.png",
    "./assets/images/linha_11.jpg",
    "./assets/images/linha_12.jpg"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                return cachedResponse || fetch(event.request);
            })
    );
});