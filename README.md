# Node Boilerplate [![CircleCI](https://circleci.com/gh/micahroberson/node-boilerplate/tree/master.svg?style=svg)](https://circleci.com/gh/micahroberson/node-boilerplate/tree/master)
This is a starter kit for new JavaScript web apps. The setup features the following:
- React, React Router, Fluxible
- Express.js, PostgreSQL for serving up the app, and JSON APIs
- Webpack for building the client-side bundle
- Mocha

##Install
```
npm install
```
##Developmet

###Database Setup
```
psql
CREATE DATABASE node_boilerplate;
CREATE DATABASE node_boilerplate_test;
CREATE USER node_boilerplate WITH PASSWORD 'password';
CREATE USER node_boilerplate_test WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE node_boilerplate TO node_boilerplate;
GRANT ALL PRIVILEGES ON DATABASE node_boilerplate_test TO node_boilerplate_test;
```

###Run it
```
# Start the express server (port 4000) and webpack-dev-server (port 8080)
make run-development
# Watch logs
make logs-development
```

##Tests
```
make test
# or npm run test
```

##TODO
- Unit tests server components
- Unit tests React components
- Integrations tests for client-side React app

