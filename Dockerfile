# Build the static bundle, then serve it from nginx as an unprivileged user.
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts
COPY . .
# production calls the API below; mock serves the bundled fictional data.
ARG BUILD_MODE=production
ARG VITE_API_BASE_URL=https://dummyjson.com
RUN npm run build -- --mode "$BUILD_MODE"

FROM nginx:1.30-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
