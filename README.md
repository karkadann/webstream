# webstream

La page hébergée de **screen-stream** : servie par le proxy du NAS, avec son certificat
(`https://ws.karkadann.ovh`). Elle cherche l'app sur le réseau du navigateur (`3.3.3.1`, son hotspot), s'y
relie par **WebRTC** (UDP/TCP 3333), puis charge la page de l'app par ce lien — décodage matériel
(WebCodecs) et GPS du navigateur, sans certificat dans l'app. Pas de stream : une ligne « No stream », un
nouvel essai toutes les 3 s.

Quatre fichiers statiques (`site/`) servis par nginx ; `config.js` est fabriqué au démarrage du conteneur.

## Déployer sur le NAS

1. Compose : `docker-compose.example.yml` (image `karkadamn/webstream:latest`, port 8095).
2. Proxy (NPMplus) : un proxy host `ws.karkadann.ovh` → `http://IP_NAS:8095`, certificat Let's Encrypt,
   « Force SSL ».
3. DNS : `ws.karkadann.ovh` vers le proxy (le générique `*.karkadann.ovh` suffit) — jamais vers `3.3.3.1`.

| Variable | Défaut | Rôle |
|---|---|---|
| `WEBSTREAM_ADDRS` | `3.3.3.1` | adresses où chercher l'app (virgules) |
| `WEBSTREAM_PORT` | `3333` | port WebRTC de l'app |
| `WEBSTREAM_FINGERPRINTS` | vide | empreintes d'AUTRES identités que celle, commune, de l'app (déjà dans la page) |

Dans l'URL : `?a=ip[,ip]` remplace les adresses (atelier) ; `?diag=1`, `?d=broadway` passent à la page de
l'app.

## Publier l'image

```bash
docker build -t karkadamn/webstream:latest . && docker push karkadamn/webstream:latest
```

Sur le NAS : `docker compose pull && docker compose up -d`.
