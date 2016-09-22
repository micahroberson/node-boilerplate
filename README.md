
##Developmet Database Setup
   psql
   CREATE DATABASE node_boilerplate;
   CREATE DATABASE node_boilerplate_test;
   CREATE USER node_boilerplate WITH PASSWORD 'password';
   CREATE USER node_boilerplate_test WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE node_boilerplate TO node_boilerplate;
   GRANT ALL PRIVILEGES ON DATABASE node_boilerplate_test TO node_boilerplate_test;