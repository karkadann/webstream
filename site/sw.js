// Service worker de la page hébergée : elle se charge aussi SANS internet (voiture hors couverture),
// le lien vers l'app, lui, restant local. Le réseau d'abord, le cache s'il ne répond pas en 3 s : une
// modification de config.js (une empreinte de plus) se voit au chargement suivant.
const CACHE = 'webstream-4';
const NET_MS = 3000;
const FILES = ['./', 'index.html', 'config.js', 'favicon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const fresh = fetch(req).then((r) => {
      if (r.ok) c.put(req.mode === 'navigate' ? './' : req, r.clone());
      return r;
    }).catch(() => null);
    const timeout = new Promise((ok) => setTimeout(() => ok(null), NET_MS));
    const got = await Promise.race([fresh, timeout]);
    if (got) return got;
    e.waitUntil(fresh);
    return (await c.match(req, { ignoreSearch: true })) || (await fresh) || new Response('offline', { status: 504 });
  }));
});
