# webstream

La page hébergée de **screen-stream** et de **web-android-auto**, publiée par GitHub Pages :
**https://karkadann.github.io/webstream/**.

Elle cherche l'app sur le réseau du navigateur (`3.3.3.1:3333`, la même adresse et le même port pour les deux
apps, jamais lancées en même temps), s'y relie par **WebRTC** (UDP ou TCP), puis charge la page de l'app qui a
répondu par ce lien — décodage matériel (WebCodecs) et GPS du navigateur, sans
certificat dans l'app. Pas de stream : une ligne « No stream », un nouvel essai toutes les 3 s. Une fois
chargée, elle se recharge aussi sans internet (service worker).

## Publier

Un push sur `master` : `.github/workflows/pages.yml` publie `site/` sur Pages. Le service worker sert la page
**depuis son cache d'abord** (ouverture instantanée, même sur un réseau faible) et la revalide auprès de
GitHub en arrière-plan : une nouvelle version se voit à la **deuxième** ouverture qui suit la publication.

⚠️ Confidentialité : GitHub (et Fastly devant lui) voit chaque ouverture en ligne — adresse IP, heure, agent
du navigateur —, ne serait-ce que par la revérification de `sw.js` que fait le navigateur lui-même. Le stream,
lui, ne passe jamais par GitHub : WebRTC direct entre le navigateur et l'app, sans serveur STUN/TURN.

## Réglages

`site/config.js` : adresses où chercher l'app (`3.3.3.1`), port (3333), empreintes d'autres identités
(vide en temps normal : l'empreinte de l'identité commune des apps est dans `index.html`). Dans l'URL :
`?a=ip[,ip]` remplace les adresses (atelier) ; `?diag=1`, `?d=broadway` passent à la page de l'app.
