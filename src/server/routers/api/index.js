import Promise from 'bluebird';
import Router from 'express-promise-router';
import {UnauthorizedAccessError} from '../../lib/errors/APIError';
import bodyParser from 'body-parser';
import RequestContext from '../../lib/RequestContext';
import usersController from '../../controllers/usersController';
import teamsController from '../../controllers/teamsController';

class ApiRouter {
  constructor(environment) {
    this.routes = new Router();
    this.setupRoutes(environment);
  }

  authorize(req, res) {
    if(!req.headers.authorization) {return Promise.reject(new UnauthorizedAccessError({message: 'Authorization header is missing.'}));}
    let encodedUserSessionId = req.headers.authorization.split(' ')[1];
    let id = new Buffer(encodedUserSessionId, 'base64').toString('utf8');
    return req.ctx.userSessionsRepository.findById(id)
      .then((userSession) => {
        if(!userSession) {throw new UnauthorizedAccessError();}
        if(userSession.expires_at && userSession.expires_at < new Date()) {throw new UnauthorizedAccessError({message: 'Your session has expired.'});}
        req.ctx.session = userSession;
        return req.ctx.usersRepository.assignTo(userSession).return('next');
      });
  }

  controllerActionHandler(action) {
    return (req, res) => {
      return action(req.ctx, Object.assign(req.params, req.payload))
        .then((responsePayload) => {
          res.payload = responsePayload;
          return 'next';
        });
    }
  }

  setupRoutes(environment) {
    this.routes.use(bodyParser.json());

    this.routes.use((req, res) => {
      console.log('Request: ', req.url);
      req.payload = (req.body && req.body.payload) ? req.body.payload : {};
      let safePayload = Object.assign({}, req.payload);
      if(safePayload.hasOwnProperty('password')) {
        safePayload.password = '********';
      }
      console.log('Request Payload: ', JSON.stringify(safePayload, undefined, 2));
      return environment.createRequestContext().then((ctx) => {
        req.ctx = ctx;
        return 'next';
      });
    });

    this.routes.post('/users/sign-in', this.controllerActionHandler(usersController.signIn));
    this.routes.post('/users/create', this.controllerActionHandler(usersController.create));
    this.routes.post('/users/me', this.authorize, this.controllerActionHandler(usersController.me));
    this.routes.post('/users/update', this.authorize, this.controllerActionHandler(usersController.update));
    this.routes.post('/users/send-password-reset-email', this.controllerActionHandler(usersController.sendResetPasswordEmail));
    this.routes.post('/users/reset-password', this.controllerActionHandler(usersController.resetPassword));
    this.routes.post('/users/verify-email', this.controllerActionHandler(usersController.verifyEmail));

    this.routes.post('/teams/create', this.authorize, this.controllerActionHandler(teamsController.create))
    this.routes.post('/teams/team', this.authorize, this.controllerActionHandler(teamsController.team))
    this.routes.post('/teams/update', this.authorize, this.controllerActionHandler(teamsController.update))
    this.routes.post('/teams/add-payment-method', this.authorize, this.controllerActionHandler(teamsController.addPaymentMethod))

    this.routes.use((req, res) => {
      return req.ctx.close().return('next');
    });

    // Response Middleware
    this.routes.use((req, res, next) => {
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

    this.routes.use((error, req, res, next) => {
      req.ctx.close()
        .catch((error) => {
          console.log('Error closing ctx: ', error);
        })
        .finally(() => {
          console.log(error.stack);
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
        })
    });
  }
}

export default ApiRouter
