# CLAUDE.md

Guide pour reprendre le développement de **webstream** avec Claude Code.

## Vue d'ensemble

La page hébergée de screen-stream (`~/projects/screen-stream`) et de web-android-auto
(`~/projects/web-android-auto`, depuis sa 0.8.0) : publiée par GitHub Pages, elle joint l'app sur le réseau
local par WebRTC, sans signalisation, et charge la page de l'app par ce lien. Les deux apps ont la même
adresse et le même port, et ne tournent jamais en même temps : la page chargée est celle de l'app qui répond. Le transport côté app et son protocole : `screen-stream/webstream/README.md` (web-android-auto en
a une copie, `web-android-auto/webstream/`).

- **GitHub Pages** : `site/` est publié tel quel par `.github/workflows/pages.yml` à chaque push sur
  `master`, à https://karkadann.github.io/webstream/ (dépôt public : Pages n'est gratuit qu'ainsi ; rien
  de secret ici). Plus de Docker ni de NAS depuis la v1.1.0.
- **Chemins relatifs partout** (`config.js`, `sw.js`, `favicon.svg`) : la page vit sous `/webstream/`.

## Publier

Un push sur `master`. Le service worker sert la page depuis son cache d'abord et la revalide en arrière-plan
(`sw.js`, cache `webstream-5`) : une version publiée se voit à la deuxième ouverture. Changer la liste des
fichiers ou leur traitement : changer aussi le nom du cache, pour purger l'ancien.

## ⛔ Contrats avec les apps

Changer l'un d'eux d'un seul côté coupe le stream :

| Élément | Où, ici | Où, dans screen-stream | Où, dans web-android-auto |
|---|---|---|---|
| Empreinte de l'identité commune (`SHARED_FP`) | `site/index.html` | `webstream/identity.go` (`SharedFingerprint`) | idem (copie) |
| Mot de passe ICE (`ICE_PWD`) | `site/index.html` | `webstream/webstream.go` (`IcePwd`) | idem (copie) |
| Voies `asset` / `ws` / `audio`, octet de tête des messages binaires | `site/index.html` | `webstream/server.go` | idem (copie) ; pas de voie `audio` (son par le téléphone) ; `ws?have=1` accepté |
| Adresse `3.3.3.1`, port 3333 | `site/config.js` | adresse de service (hotspot, ou VPN sans la clé platform) | idem (VPN de l'app ; `net/Webstream.PORT`) |

Le site n'a pas de banc d'essai ici : `screen-stream/webstream/devserver` joue une fausse app (cf. son
README), avec `-site ~/projects/webstream/site`.

## Conventions de travail (préférence utilisateur)

- **Ne rien committer/pousser (Git ou Docker Hub) sans demande explicite.**
- Langue des textes : français dans le code et la doc, anglais dans la page.
