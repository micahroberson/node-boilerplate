import express from 'express';
import Router from 'express-promise-router';
import bodyParser from 'body-parser';
import RequestContext from './lib/RequestContext';
import UsersRouter from './config/routers/UsersRouter';

const Port = parseInt(process.env.PORT);
const env = process.env.NODE_ENV;
const server = express();

server.disable('x-powered-by');

const apiRouter = new Router();

apiRouter.use(bodyParser.json());

apiRouter.use((req, res, next) => {
  req.ctx = new RequestContext(req);
  req.payload = (req.body && req.body.payload) ? req.body.payload : {};
  let safePayload = Object.assign({}, req.payload);
  if(safePayload.hasOwnProperty('password')) {
    safePayload.password = '********';
  }
  console.log('Request Payload: ', JSON.stringify(safePayload, undefined, 2));
  next();
});

apiRouter.use('/users', UsersRouter);

// Response Middleware
apiRouter.use((req, res, next) => {
  if(req.responseJSON) {
    return res.send(JSON.stringify(req.responseJSON));
  }
  res.status(404);
  res.send('Route not found');
});

apiRouter.use((error, req, res, next) => {
  console.log('Error: ', error);
  res.send(JSON.stringify({
    success: false,
    error: {
      name: error.name,
      message: error.message,
      code: error.code
    }
  }));
});

server.use('/api', apiRouter);

server.listen(Port, () => {
  console.log('listening on port: %s', Port);
});