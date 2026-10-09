# syntax=docker/dockerfile:1
# webstream — la page hébergée de screen-stream : quatre fichiers statiques servis par nginx.
# config.js est fabriqué au démarrage d'après l'environnement (cf. docker/entrypoint.sh).
FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /docker-entrypoint.d/40-webstream-config.sh
COPY site/ /usr/share/nginx/html/
RUN chmod +x /docker-entrypoint.d/40-webstream-config.sh \
 && chown nginx /usr/share/nginx/html

ARG APP_VERSION=dev
LABEL org.opencontainers.image.title="webstream" \
      org.opencontainers.image.version="${APP_VERSION}"

# Réglages (cf. docker-compose.example.yml) : où la page cherche l'app, et d'éventuelles empreintes
# d'autres identités que l'identité commune de l'app (déjà écrite dans index.html).
ENV WEBSTREAM_ADDRS=3.3.3.1 \
    WEBSTREAM_PORT=3333 \
    WEBSTREAM_FINGERPRINTS=

EXPOSE 80
