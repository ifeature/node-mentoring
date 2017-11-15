#### Build
`$ docker build -t node-app .`  
`$ docker build -t node-db postgres/`

#### Connect through psql
`$ docker run -it --rm --link node-db:postgres postgres psql -h postgres -U postgres`

#### Run
##### Run database container
`$ docker container run --name node-db -p 5432:5432 node-db:latest`
##### Run application container
`$ docker container run -it --name node-app --link node-db:postgres --rm -p 8080:8080 -v ~/Desktop/node-hw/:/usr/src/app/ node-app`
##### Create database (through psql cli)
`$ create database mydb;`
##### Create database user (through psql cli)
`$ create user bob with password 'mypass'`