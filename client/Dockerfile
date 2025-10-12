FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/public /usr/share/nginx/html/public
COPY nginx.conf /etc/nginx/conf.d/default.conf
