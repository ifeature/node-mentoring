FROM mongo:3.5.13
LABEL maintainer="ifeature@yandex.ru"
EXPOSE 27017

COPY cities.json /cities.json
COPY users.json /users.json
COPY products.json /products.json

#CMD mongoimport --host 127.0.0.1 --db mydb --collection cities --type json --file /cities.json --jsonArray

