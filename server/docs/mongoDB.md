exec to mongo container

docker exec -it mongodb7 mongosh \
 -u admin \
 -p admin \
 --authenticationDatabase admin

Using MongoDB: 7.0.34

startup

docker run -d --name mongodb7 -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin mongo:7

connection via MongoCompass
mongodb://admin:admin@localhost:27017/?authSource=admin
