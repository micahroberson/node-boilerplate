import _ from 'lodash';
import Promise from 'bluebird';
import bcrypt from 'bcrypt';
import User from '../../shared/models/User';
import UserSession from '../../shared/models/UserSession';
import ParametersInvalidError from '../lib/errors/ParametersInvalidError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

const InvalidEmailPasswordErrorValues = {message: 'The email/password combination you provided is invalid.'};

const UsersController = {
  create: (ctx, payload) => {
    if(!payload.email || !payload.email || !payload.password) {return Promise.reject(new ParametersInvalidError({message: 'name, email and password are all required.'}));}
    let user = new User(payload);
    return ctx.usersRepository.create(user)
      .then((user) => {
        return serializeUser(user);
      });
  },

  signIn: (ctx, payload) => {
    if(!payload.email || !payload.password) {return Promise.reject(new ParametersInvalidError(InvalidEmailPasswordErrorValues));}
    return ctx.usersRepository.findbyEmail(payload.email)
      .then((user) => {
        if(!user) {throw new ParametersInvalidError(InvalidEmailPasswordErrorValues);}
        return new Promise((resolve, reject) => {
          bcrypt.compare(payload.password, user.encrypted_password, (error, authenticated) => {
            if(error || !authenticated) {return reject(new ParametersInvalidError(InvalidEmailPasswordErrorValues));}
            let session = new UserSession({user_id: user.id});
            ctx.userSessionsRepository.create(session)
              .then((session) => {
                return resolve(Object.assign({session_token: session.id}, serializeUser(user)));
              })
              .catch((error) => {
                return reject(error);
              });
          });
        });
      });
  },

  update: (ctx, payload) => {
    if(ctx.session.user.id !== payload.id) {return Promise.reject(new UnauthorizedError());}
    return ctx.usersRepository.update(ctx.session.user, payload)
      .then((user) => {
        return serializeUser(user);
      });
  },

  user: (ctx, payload) => {
    if(ctx.session.user.id !== payload.id) {return Promise.reject(new UnauthorizedError());}
    return Promise.resolve(serializeUser(ctx.session.user));
  }
};

export default UsersController;

function serializeUser(user) {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  };
}