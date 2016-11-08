import Promise from 'bluebird';
import express from 'express';
import {UnauthorizedAccessError, InactiveSubscriptionError} from '../../lib/errors/APIError';
import bodyParser from 'body-parser';
import RequestContext from '../../lib/RequestContext'
import {SubscriptionStatuses} from '../../../common/models/Subscription';
import subscriptionsController from '../../controllers/subscriptionsController';
import subscriptionPlansController from '../../controllers/subscriptionPlansController';
import teamsController from '../../controllers/teamsController';
import usersController from '../../controllers/usersController';

class ApiRouter {
  constructor(environment) {
    this.routes = new express.Router();
    this.setupRoutes(environment);
  }

  authorize(req, res, next) {
    if(!req.headers.authorization) {return next(new UnauthorizedAccessError({message: 'Authorization header is missing.'}));}
    let encodedUserSessionId = req.headers.authorization.split(' ')[1];
    let id = new Buffer(encodedUserSessionId, 'base64').toString('utf8');
    return req.ctx.userSessionsRepository.findById(id)
      .then((userSession) => {
        if(!userSession) {return next(new UnauthorizedAccessError());}
        if(userSession.expires_at && userSession.expires_at < new Date()) {return next(new UnauthorizedAccessError({message: 'Your session has expired.'}));}
        req.ctx.session = userSession;
        return req.ctx.usersRepository.assignTo(userSession);
      })
      .then(() => {
        next();
        return null;
      })
      .catch(next);
  }

  authorizeAdmin(req, res, next) {
    if(!req.ctx.session) {return next(new UnauthorizedAccessError());}
    if(!req.ctx.session.user.permissions.super_user) {return next(new UnauthorizedAccessError());}
    return next();
  }

  requireActiveSubscription(req, res, next) {
    let user = req.ctx.session.user;
    if(!user.team_id) {return next(new InactiveSubscriptionError());}
    let findTeam = () => {
      return req.ctx.teamsRepository.findById(req.ctx.session.user.team_id);
    };
    let assignSubscriptions = (team) => {
      return req.ctx.subscriptionsRepository.assignManyTo(team);
    };
    let verifySubscriptionStatus = (team) => {
      return team.subscriptions.find((s) => {
        return s.status === SubscriptionStatuses.Trialing || s.status === SubscriptionStatuses.Active;
      });
    };
    return findTeam()
      .then(assignSubscriptions)
      .then(verifySubscriptionStatus);
  }

  controllerActionHandler(action) {
    return (req, res, next) => {
      return action(req.ctx, Object.assign(req.params, req.payload))
        .then((responsePayload) => {
          res.payload = responsePayload;
          next();
          return null;
        })
        .catch(next);
    }
  }

  setupRoutes(environment) {
    this.routes.use(bodyParser.json());

    this.routes.use((req, res, next) => {
      console.log('Request: ', req.url);
      req.payload = (req.body && req.body.payload) ? req.body.payload : {};
      let safePayload = Object.assign({}, req.payload);
      if(safePayload.hasOwnProperty('password')) {
        safePayload.password = '********';
      }
      console.log('Request Payload: ', JSON.stringify(safePayload, undefined, 2));
      return environment.createRequestContext().then((ctx) => {
        req.ctx = ctx;
        next();
        return null;
      })
      .catch(next);
    });

    // User routes
    this.routes.post('/users/sign-in', this.controllerActionHandler(usersController.signIn));
    this.routes.post('/users/create', this.controllerActionHandler(usersController.create));
    this.routes.post('/users/me', this.authorize, this.controllerActionHandler(usersController.me));
    this.routes.post('/users/update', this.authorize, this.controllerActionHandler(usersController.update));
    this.routes.post('/users/send-password-reset-email', this.controllerActionHandler(usersController.sendResetPasswordEmail));
    this.routes.post('/users/reset-password', this.controllerActionHandler(usersController.resetPassword));
    this.routes.post('/users/verify-email', this.controllerActionHandler(usersController.verifyEmail));

    this.routes.post('/teams/create', this.authorize, this.controllerActionHandler(teamsController.create));
    this.routes.post('/teams/team', this.authorize, this.controllerActionHandler(teamsController.team));
    this.routes.post('/teams/update', this.authorize, this.controllerActionHandler(teamsController.update));
    this.routes.post('/teams/add-payment-method', this.authorize, this.controllerActionHandler(teamsController.addPaymentMethod));

    this.routes.post('/subscriptions/create', this.authorize, this.controllerActionHandler(subscriptionsController.create));
    this.routes.post('/subscriptions/update', this.authorize, this.controllerActionHandler(subscriptionsController.update));
    this.routes.post('/subscriptions/subscription', this.authorize, this.controllerActionHandler(subscriptionsController.subscription));

    this.routes.post('/subscription-plans/list', this.controllerActionHandler(subscriptionPlansController.list));

    // Admin routes
    this.routes.post('/admin/subscription-plans/list', this.authorize, this.authorizeAdmin, this.controllerActionHandler(subscriptionPlansController.list));
    this.routes.post('/admin/subscription-plans/create', this.authorize, this.authorizeAdmin, this.controllerActionHandler(subscriptionPlansController.create));

    this.routes.use((req, res, next) => {
      return req.ctx.close()
        .then(() => {
          next();
          return null;
        })
        .catch(next);
    });

    // Response Middleware
    this.routes.use((req, res, next) => {
      if(res.payload) {
        let responseJSON = {
          success: true,
          payload: res.payload
        };
        console.log('Response: ', JSON.stringify(responseJSON, undefined, 2));
        return res.json(responseJSON);
      }
      res.status(404);
      res.send('Route not found');
    });

    this.routes.use((error, req, res, next) => {
      console.log('Error: ', error);
      return req.ctx.close()
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
        });
    });
  }
}

export default ApiRouter
