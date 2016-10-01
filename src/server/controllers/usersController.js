import _ from 'lodash';
import Promise from 'bluebird';
import bcrypt from 'bcrypt';
import User from '../../common/models/User';
import UserSession from '../../common/models/UserSession';
import {ParametersInvalidError, UnauthorizedAccessError} from '../lib/errors/APIError';

const InvalidEmailPasswordErrorValues = {message: 'The email/password combination you provided is invalid.'};
const ONE_DAY = 60 * 60 * 24 * 1000;

const usersController = {
  create(ctx, payload) {
    if(!payload.name || !payload.email || !payload.password) {return Promise.reject(new ParametersInvalidError({message: 'name, email and password are all required.'}));}
    let commit = (session) => {
      return ctx.providerClients.postgresProviderClient
        .commit()
        .return(session);
    };
    let rollback = (error) => {
      return ctx.providerClients.postgresProviderClient
        .rollback()
        .return(error);
    };
    let createUser = (team) => {
      let user = new User(payload);
      return ctx.usersRepository.create(user);
    };
    let createSessionForUser = (user) => {
      let session = new UserSession({user_id: user.id});
      session.user = user;
      return ctx.userSessionsRepository.create(session);
    };
    let enqueueSendWelcomeEmailJob = (session) => {
      return ctx.providerClients.bullQueueProviderClient
        .enqueue('SendWelcomeEmail', {user_id: session.user.id})
        .return(session);
    };
    let serializeResponse = (session) => {
      return {
        session_token: session.id,
        user: serializeUser(session.user)
      };
    };

    return ctx.providerClients.postgresProviderClient
      .transaction()
      .then(createUser)
      .then(createSessionForUser)
      .then(commit)
      .catch(rollback)
      .then(enqueueSendWelcomeEmailJob)
      .then(serializeResponse);
  },

  signIn(ctx, payload) {
    if(!payload.email || !payload.password) {return Promise.reject(new ParametersInvalidError(InvalidEmailPasswordErrorValues));}
    let authenticate = (user) => {
      if(!user) {throw new ParametersInvalidError(InvalidEmailPasswordErrorValues);}
      return new Promise((resolve, reject) => {
        bcrypt.compare(payload.password, user.encrypted_password, (error, authenticated) => {
          if(error || !authenticated) {return reject(new ParametersInvalidError(InvalidEmailPasswordErrorValues));}
          return resolve(user);
        });
      });
    };
    let createSessionForUser = (user) => {
      let session = new UserSession({user_id: user.id});
      session.user = user;
      return ctx.userSessionsRepository.create(session);
    };
    let serializeResponse = (session) => {
      return {
        session_token: session.id,
        user: serializeUser(session.user)
      };
    };
    return ctx.usersRepository.findByEmail(payload.email)
      .then(authenticate)
      .then(createSessionForUser)
      .then(serializeResponse);
  },

  update(ctx, payload) {
    if(ctx.session.user.id !== payload.id) {return Promise.reject(new UnauthorizedAccessError());}
    return ctx.usersRepository.update(ctx.session.user, payload)
      .then((user) => {
        return {user: serializeUser(user)};
      });
  },

  me(ctx, payload) {
    return Promise.resolve({user: serializeUser(ctx.session.user)});
  },

  sendResetPasswordEmail(ctx, payload) {
    if(!payload.email) {return Promise.reject(new ParametersInvalidError({message: 'email must be provided'}));}
    return ctx.usersRepository.findByEmail(payload.email)
      .then((user) => {
        if(!user) {return Promise.resolve({});}
        return ctx.providerClients.bullQueueProviderClient
          .enqueue('SendPasswordResetEmail', {user_id: user.id})
          .then(() => {
            return {};
          });
      });
  },

  resetPassword(ctx, payload) {
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

  verifyEmail(ctx, payload) {
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

export function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name
  };
}
