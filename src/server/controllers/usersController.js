import _ from 'lodash';
import Promise from 'bluebird';
import bcrypt from 'bcrypt';
import User from '../../common/models/User';
import UserSession from '../../common/models/UserSession';
import ParametersInvalidError from '../lib/errors/ParametersInvalidError';
import UnauthorizedAccessError from '../lib/errors/UnauthorizedAccessError';

const InvalidEmailPasswordErrorValues = {message: 'The email/password combination you provided is invalid.'};
const ONE_DAY = 60 * 60 * 24 * 1000;

const usersController = {
  create: (ctx, payload) => {
    if(!payload.name || !payload.email || !payload.password) {return Promise.reject(new ParametersInvalidError({message: 'name, email and password are all required.'}));}
    let user = new User(payload);
    return ctx.usersRepository.create(user)
      .then((user) => {
        let session = new UserSession({user_id: user.id});
        return ctx.userSessionsRepository.create(session)
          .then((session) => {
            return ctx.providerClients.bullQueueProviderClient.enqueue('SendWelcomeEmail', {user_id: user.id})
              .then(() => {
                console.log('finally');
                return Object.assign({session_token: session.id}, serializeUser(user));
              });
          });
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
    if(ctx.session.user.id !== payload.id) {return Promise.reject(new UnauthorizedAccessError());}
    return ctx.usersRepository.update(ctx.session.user, payload)
      .then((user) => {
        return serializeUser(user);
      });
  },

  me: (ctx, payload) => {
    return Promise.resolve(serializeUser(ctx.session.user));
  },

  sendResetPasswordEmail: (ctx, payload) => {
    if(!payload.email) {return Promise.reject(new ParametersInvalidError({message: 'email must be provided'}));}
    return ctx.usersRepository.findbyEmail(payload.email)
      .then((user) => {
        if(!user) {return Promise.resolve({});}
        return ctx.providerClients.bullQueueProviderClient
          .enqueue('SendPasswordResetEmail', {user_id: user.id})
          .then(() => {
            return {};
          });
      });
  },

  resetPassword: (ctx, payload) => {
    return ctx.usersRepository.find({password_reset_token: payload.password_reset_token})
      .then((users) => {
        if(!(users && users.length)) {
          return Promise.reject(new ParametersInvalidError({message: 'The token you provided is invalid.'}));
        }
        let user = users[0];
        if(user.password_reset_token_redeemed_at) {
          return Promise.reject(new ParametersInvalidError({message: 'The token you provided has already been used. Please request a new one.'}));
        }
        if((new Date()) - user.password_reset_token_sent_at > ONE_DAY) {
          return Promise.reject(new ParametersInvalidError({message: 'The token you provided has expired.'}));
        }
        return ctx.usersRepository.update(user, {
          password: payload.password,
          password_reset_token_redeemed_at: new Date()
          })
          .then((user) => {
            return {};
          });
      });
  },

  verifyEmail: (ctx, payload) => {
    return ctx.usersRepository.find({email_verification_token: payload.email_verification_token})
      .then((users) => {
        if(!(users && users.length)) {
          return Promise.reject(new ParametersInvalidError({message: 'The token you provided is invalid.'}));
        }
        return ctx.usersRepository.update(users[0], {email_verified_at: new Date()})
          .then((user) => {
            return {email: user.email};
          });
      });
  }
};

export default usersController;

function serializeUser(user) {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  };
}