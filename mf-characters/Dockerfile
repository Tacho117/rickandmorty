# ---- Etapa 1: construir con Node ----
FROM node:20-alpine AS build
WORKDIR /app
# Primero solo package*.json: si no cambian las dependencias, Docker reutiliza la capa de npm ci (build más rápido)
COPY package*.json ./
RUN npm ci
COPY . .
# URL pública desde donde el navegador descargará este MF
ARG PUBLIC_URL=http://localhost:3001/
ENV PUBLIC_URL=$PUBLIC_URL
RUN npm test -- --ci && npm run build

# ---- Etapa 2: servir los archivos estáticos con nginx (imagen final ligera, sin Node) ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD wget -q --spider http://127.0.0.1/remoteEntry.js || exit 1
