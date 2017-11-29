#### Build
`$ docker build -t node-app .`  
`$ docker build -t node-db postgres/`  
`$ docker build -t node-mongo mongo/`

#### Connect to postgres through CLI
`$ docker run -it --rm --link node-db:postgres postgres psql -h postgres -U postgres`

#### Connect to mongo through CLI
`$ docker run -it --link node-mongo:mongo --rm mongo sh -c 'exec mongo "$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/test"'`

#### Get inside running docker mongo instance
`$ sudo docker exec -i -t node-mongo bash`

#### Import data from file
`$ mongoimport --db mydb --collection cities --type json --file /cities.json --jsonArray`
`$ mongoimport --db mydb --collection users --type json --file /users.json --jsonArray`
`$ mongoimport --db mydb --collection products --type json --file /products.json --jsonArray`

#### Run
##### Run postgres container
`$ docker container run --name node-db -p 5432:5432 node-db:latest`
##### Run mongo container
`$ docker container run --name node-mongo node-mongo:latest`
##### Run application container
`$ docker container run -it --name node-app --link node-db:postgres --link node-mongo:mongo --rm -p 8080:8080 -v ~/Desktop/node-hw/:/usr/src/app/ node-app`
##### Create database (through psql cli)
`$ create database mydb;`
##### Create database user (through psql cli)
`$ create user bob with password 'mypass'`


