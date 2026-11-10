FROM nginx:1.27-alpine

# Configuration nginx dédiée (sous-chemins /demos/<slug>/, mime wasm, gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Démos statiques déjà construites (web/dist uniquement)
COPY . /usr/share/nginx/html

EXPOSE 80
