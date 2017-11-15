FROM node:8.4.0
LABEL maintainer="ifeatur@yandex.ru"

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

EXPOSE 8080
CMD ["node_modules/.bin/nodemon", "express-app/index.js"]

VOLUME /usr/src/app/
