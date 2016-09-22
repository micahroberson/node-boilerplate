import Router from 'express-promise-router';
import bodyParser from 'body-parser';
import RequestContext from '../lib/RequestContext';
import UsersRouter from './UsersRouter';

const ApiRouter = new Router();

ApiRouter.use(bodyParser.json());

ApiRouter.use((req, res, next) => {
  console.log('Request: ', req.url);
  req.ctx = new RequestContext(req);
  req.payload = (req.body && req.body.payload) ? req.body.payload : {};
  let safePayload = Object.assign({}, req.payload);
  if(safePayload.hasOwnProperty('password')) {
    safePayload.password = '********';
  }
  console.log('Request Payload: ', JSON.stringify(safePayload, undefined, 2));
  next();
});

ApiRouter.use('/users', UsersRouter);

// Response Middleware
ApiRouter.use((req, res, next) => {
  if(res.payload) {
    let responseJSON = {
      success: true,
      payload: res.payload
    };
    console.log('Response: ', responseJSON);
    return res.json(responseJSON);
  }
  res.status(404);
  res.send('Route not found');
});

ApiRouter.use((error, req, res, next) => {
  let responseJSON = {
    success: false,
    error: {
      name: error.name,
      message: error.message,
      code: error.code
    }
  };
  console.log('Response: ', responseJSON);
  res.json(responseJSON);
});

export default ApiRouter
