import Promise from 'bluebird';
import Router from 'express-promise-router';
import {UnauthorizedAccessError} from '../../lib/errors/APIError';

class BaseApiRouter {
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
        return req.ctx.usersRepository.assignToObjects(userSession)
          .then(() => {
            return 'next';
          });
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
}

export default BaseApiRouter
