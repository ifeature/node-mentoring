##### Build
`$ docker build -t node-app .`  
`$ docker build -t node-db postgres/`

#### Run  
`$ docker container run -it --name node-app --link node-db:postgres --rm -p 8080:8080 -v ~/Desktop/node-hw/:/usr/src/app/ node-app`   
`$ docker container run --name node-db -p 5432:5432 node-db:latest`

#### Connect through psql
`$ docker run -it --rm --link node-db:postgres postgres psql -h postgres -U postgres`

#### Create db user
`$ create user bob with password 'mypass'`