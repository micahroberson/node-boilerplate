# Node Boilerplate [![CircleCI](https://circleci.com/gh/micahroberson/node-boilerplate/tree/master.svg?style=svg)](https://circleci.com/gh/micahroberson/node-boilerplate/tree/master)
This is a starter kit for new JavaScript web apps. The setup features the following:
- React, React Router, Fluxible
- Express.js, PostgreSQL for serving up the app, and JSON APIs
- Webpack for building the client-side bundle
- Mocha

##Install
```
make install
make db-setup
```
##Developmet

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

