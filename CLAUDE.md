# CLAUDE.md

Guide pour reprendre le développement de **webstream** avec Claude Code.

## Vue d'ensemble

La page hébergée de screen-stream (`~/projects/screen-stream`) : servie par le proxy du NAS, elle joint
l'app sur le réseau local par WebRTC, sans signalisation, et charge la page de l'app par ce lien. Le
transport côté app et son protocole sont décrits dans `screen-stream/webstream/README.md`.

- **Image** : nginx alpine, quatre fichiers statiques (`site/`) ; `config.js` fabriqué au démarrage par
  `docker/entrypoint.sh` d'après l'environnement (cf. README).
- **Rien d'autre n'est servi** (`docker/nginx.conf`) : tout autre chemin répond 404.

## Commandes

```bash
# Le compose TIRE l'image publiée — il ne build pas.
docker build -t karkadamn/webstream:latest . && docker compose up -d
# Publier : docker push karkadamn/webstream:latest
```

## ⛔ Contrats avec screen-stream

Changer l'un d'eux d'un seul côté coupe le stream :

| Élément | Où, ici | Où, dans screen-stream |
|---|---|---|
| Empreinte de l'identité commune (`SHARED_FP`) | `site/index.html` | `webstream/identity.go` (`SharedFingerprint`) |
| Mot de passe ICE (`ICE_PWD`) | `site/index.html` | `webstream/webstream.go` (`IcePwd`) |
| Port 3333, voies `asset` / `ws` / `audio`, octet de tête des messages binaires | `site/index.html`, `WEBSTREAM_PORT` | `webstream/server.go` |
| Adresse `3.3.3.1` | `WEBSTREAM_ADDRS` | adresse de service de l'app (hotspot, ou VPN sans la clé platform) |

Le site n'a pas de banc d'essai ici : `screen-stream/webstream/devserver` joue une fausse app (cf. son
README), avec `-site ~/projects/webstream/site`.

## Conventions de travail (préférence utilisateur)

- **Ne rien committer/pousser (Git ou Docker Hub) sans demande explicite.**
- Langue des textes : français dans le code et la doc, anglais dans la page.
