FROM node:13.13.0 AS FRONTEND

ARG NPM_RUN_COMMAND=dev
ARG BACKEND_PROTOCOL=http
ARG BACKEND_HOST='0.0.0.0'
ARG BACKEND_PORT='8000'
ENV NRC $NPM_RUN_COMMAND
ENV BACKEND_PROTOCOL $BACKEND_PROTOCOL
ENV BACKEND_HOST $BACKEND_HOST
ENV BACKEND_PORT $BACKEND_PORT

WORKDIR /node
COPY package.json package-lock.json ./

RUN ["npm", "install"]

COPY . .

RUN ["sh", "-c", "npm run $NRC"]



FROM nginx:1.17-alpine

WORKDIR /app
EXPOSE 80

COPY --from=FRONTEND /node/dist /app/dist
COPY ./nginx/conf.d/development.conf /etc/nginx/conf.d/default.conf

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
