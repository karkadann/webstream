// Service worker de la page hébergée : elle se charge aussi SANS internet (voiture hors couverture),
// le lien vers l'app, lui, restant local. Le cache d'abord : la page s'affiche aussitôt, même sur un
// réseau faible (le réseau d'abord y faisait attendre jusqu'à 3 s), puis ses fichiers sont redemandés
// en arrière-plan pour l'ouverture suivante — une version publiée se voit donc une ouverture plus tard.
// ⚠️ Ne cache rien à GitHub : le navigateur revérifie de lui-même ce fichier à chaque ouverture en ligne.
const CACHE = 'webstream-5';
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
  // La page, quels que soient ses paramètres (?diag=1, ?a=…), est rangée sous './'.
  const key = req.mode === 'navigate' ? './' : req.url.split('?')[0];
  e.respondWith(caches.open(CACHE).then(async (c) => {
    // `no-cache` : revalidée auprès de GitHub (ETag), pas reprise des 10 min de son cache HTTP.
    const fresh = fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then((r) => {
      if (r.ok) return c.put(key, r.clone()).then(() => r);
      return r;
    }).catch(() => null);
    const kept = await c.match(key, { ignoreSearch: true });
    if (kept) {
      e.waitUntil(fresh);
      return kept;
    }
    return (await fresh) || new Response('offline', { status: 504 });
  }));
});
