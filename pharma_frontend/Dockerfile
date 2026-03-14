# ── Stage 1 : build ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# La variable d'environnement sera injectée au build
ARG VITE_API_BASE_URL=http://localhost:8000/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ── Stage 2 : runtime (Nginx) ────────────────────────────────────────────────
FROM nginx:alpine

# Supprime la config nginx par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copie la config nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/pharma.conf

# Copie le build Vite généré
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
