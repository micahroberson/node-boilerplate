import Promise from 'bluebird';
import UsersRepository from '../../repositories/UsersRepository';
import UserSessionsRepository from '../../repositories/UserSessionsRepository';
import UnauthorizedError from '../errors/UnauthorizedError';

class RequestContext {
  constructor() {
    this._usersRepository = null;
    this._userSessionsRepository = null;
    this.session = null;
  }

  get usersRepository() {
    if(!this._usersRepository) {
      this._usersRepository = new UsersRepository();
    }
    return this._usersRepository;
  }

  get userSessionsRepository() {
    if(!this._userSessionsRepository) {
      this._userSessionsRepository = new UserSessionsRepository();
    }
    return this._userSessionsRepository;
  }

  static authorize(req, res) {
    if(!req.headers.authorization) {return Promise.reject(new UnauthorizedError({message: 'Authorization header is missing.'}));}
    let encodedUserSessionId = req.headers.authorization.split(' ')[1];
    let id = new Buffer(encodedUserSessionId, 'base64').toString('utf8');
    return req.ctx.userSessionsRepository.findbyId(id)
      .then((userSession) => {
        if(!userSession) {throw new UnauthorizedError();}
        if(userSession.expires_at && userSession.expires_at < new Date()) {throw new UnauthorizedError({message: 'Your session has expired.'});}
        req.ctx.session = userSession;
        return req.ctx.usersRepository.assignToObjects(userSession)
          .then(() => {
            return 'next';
          });
      });
  }
}

export default RequestContext;
