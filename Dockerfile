# =============================================================================
#  Interface Agôn Cup — image de production : nginx sert les fichiers construits
#  et transmet /api, /health, /apidoc et /socket.io à l'API (nginx.conf).
#
#  L'interface et l'API partagent ainsi la même adresse : pas de CORS, et le cookie
#  de session est un cookie de même site.
#
#  Lancement de toute la pile : voir docker-compose.complet.yml dans le dépôt back.
# =============================================================================

FROM node:22-alpine AS construction
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Vide = la même adresse que la page (voir src/api/client.ts).
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=construction /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=6 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
