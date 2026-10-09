# CLAUDE.md

Guide pour reprendre le développement de **webstream** avec Claude Code.

## Vue d'ensemble

La page hébergée de screen-stream (`~/projects/screen-stream`) : publiée par GitHub Pages, elle joint
l'app sur le réseau local par WebRTC, sans signalisation, et charge la page de l'app par ce lien. Le
transport côté app et son protocole sont décrits dans `screen-stream/webstream/README.md`.

- **GitHub Pages** : `site/` est publié tel quel par `.github/workflows/pages.yml` à chaque push sur
  `master`, à https://karkadann.github.io/webstream/ (dépôt public : Pages n'est gratuit qu'ainsi ; rien
  de secret ici). Plus de Docker ni de NAS depuis la v1.1.0.
- **Chemins relatifs partout** (`config.js`, `sw.js`, `favicon.svg`) : la page vit sous `/webstream/`.

## Publier

Un push sur `master`. GitHub garde les fichiers en cache 10 min.

## ⛔ Contrats avec screen-stream

Changer l'un d'eux d'un seul côté coupe le stream :

| Élément | Où, ici | Où, dans screen-stream |
|---|---|---|
| Empreinte de l'identité commune (`SHARED_FP`) | `site/index.html` | `webstream/identity.go` (`SharedFingerprint`) |
| Mot de passe ICE (`ICE_PWD`) | `site/index.html` | `webstream/webstream.go` (`IcePwd`) |
| Port 3333, voies `asset` / `ws` / `audio`, octet de tête des messages binaires | `site/index.html`, `site/config.js` | `webstream/server.go` |
| Adresse `3.3.3.1` | `site/config.js` | adresse de service de l'app (hotspot, ou VPN sans la clé platform) |

Le site n'a pas de banc d'essai ici : `screen-stream/webstream/devserver` joue une fausse app (cf. son
README), avec `-site ~/projects/webstream/site`.

## Conventions de travail (préférence utilisateur)

- **Ne rien committer/pousser (Git ou Docker Hub) sans demande explicite.**
- Langue des textes : français dans le code et la doc, anglais dans la page.
