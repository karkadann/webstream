# webstream

La page hébergée de **screen-stream** et de **web-android-auto**, publiée par GitHub Pages :
**https://karkadann.github.io/webstream/**.

Elle cherche l'app sur le réseau du navigateur (`3.3.3.1:3333`, la même adresse et le même port pour les deux
apps, jamais lancées en même temps), s'y relie par **WebRTC** (UDP ou TCP), puis charge la page de l'app qui a
répondu par ce lien — décodage matériel (WebCodecs) et GPS du navigateur, sans
certificat dans l'app. Pas de stream : une ligne « No stream », un nouvel essai toutes les 3 s. Une fois
chargée, elle se recharge aussi sans internet (service worker).

## Publier

Un push sur `master` : `.github/workflows/pages.yml` publie `site/` sur Pages. GitHub garde les fichiers
en cache 10 min, et le service worker sert sa copie avant la nouvelle : une mise à jour se voit au plus tard
au deuxième chargement, 10 min après le push.

## Réglages

`site/config.js` : adresses où chercher l'app (`3.3.3.1`), port (3333), empreintes d'autres identités
(vide en temps normal : l'empreinte de l'identité commune des apps est dans `index.html`). Dans l'URL :
`?a=ip[,ip]` remplace les adresses (atelier) ; `?diag=1`, `?d=broadway` passent à la page de l'app.
