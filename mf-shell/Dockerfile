# ---- Etapa 1: construir con Node ----
FROM node:20-alpine AS build
WORKDIR /app
# Primero solo package*.json: si no cambian las dependencias, Docker reutiliza la capa de npm ci
COPY package*.json ./
RUN npm ci
COPY . .
# URLs públicas de los remotos (las usa el navegador del usuario)
ARG CHARACTERS_URL=http://localhost:3001
ARG DETAIL_URL=http://localhost:3002
ENV CHARACTERS_URL=$CHARACTERS_URL DETAIL_URL=$DETAIL_URL
RUN npm test -- --ci && npm run build

# ---- Etapa 2: servir los archivos estáticos con nginx (imagen final ligera, sin Node) ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
