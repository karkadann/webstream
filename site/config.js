// Réglages de la page (cf. index.html). Rien d'obligatoire.
//   addrs        : adresses IPv4 où chercher l'app (3.3.3.1 : son adresse de service sur le hotspot).
//   port         : port WebRTC de l'app (UDP et TCP).
//   fingerprints : empreintes d'AUTRES identités que l'identité commune de l'app (déjà écrite dans
//                  index.html, SHARED_FP) ; vide en temps normal.
window.WEBSTREAM_CONFIG = {
  addrs: ['3.3.3.1'],
  port: 3333,
  fingerprints: [],
};
