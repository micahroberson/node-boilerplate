import Promise from 'bluebird';
import User from '../models/User';
import {browserHistory} from 'react-router';

const userActions = {
  signIn: (context, payload) => {
    context.dispatch('USER_SIGN_IN_START', null);
    if(!payload.email || !payload.email.match(/.@./)) {
      let error = new Error('Please enter your email');
      context.dispatch('USER_SIGN_IN_FAILURE', {error});
      return Promise.resolve(null);
    }
    if(!payload.password) {
      let error = new Error('Please enter your password');
      context.dispatch('USER_SIGN_IN_FAILURE', {error});
      return Promise.resolve(null);
    }
    return context
      .api
      .users
      .signIn(payload)
      .then((responsePayload) => {
        let user = new User(responsePayload.user);
        let sessionToken = responsePayload.session_token;
        context.api.setSessionToken(sessionToken);
        context.dispatch('USER_SIGN_IN_SUCCESS', user);
        browserHistory.push('/');
        return user;
      })
      .catch((error) => {
        context.dispatch('USER_SIGN_IN_FAILURE', {error});
        return null;
      });
  },
  signUp: (context, payload) => {
    context.dispatch('USER_SIGN_UP_START', null);
    if(!payload.name) {
      let error = new Error('Please enter your full name');
      context.dispatch('USER_SIGN_UP_FAILURE', {error});
      return Promise.resolve(null);
    }
    if(!payload.email || !payload.email.match(/.@./)) {
      let error = new Error('Please enter your email');
      context.dispatch('USER_SIGN_UP_FAILURE', {error});
      return Promise.resolve(null);
    }
    if(!payload.password) {
      let error = new Error('Please enter your password');
      context.dispatch('USER_SIGN_UP_FAILURE', {error});
      return Promise.resolve(null);
    }
    return context
      .api
      .users
      .create(payload)
      .then((responsePayload) => {
        let user = new User(responsePayload.user);
        let sessionToken = responsePayload.session_token;
        context.api.setSessionToken(sessionToken);
        context.dispatch('USER_SIGN_UP_SUCCESS', user);
        browserHistory.push('/');
        return user;
      })
      .catch((error) => {
        context.dispatch('USER_SIGN_UP_FAILURE', {error});
        return null;
      });
  },
  me: (context, payload) => {
    context.dispatch('USER_ME_START', null);
    return context
      .api
      .users
      .me({})
      .then((responsePayload) => {
        let user = new User(responsePayload.user);
        context.dispatch('USER_ME_SUCCESS', user);
        return user;
      })
      .catch((error) => {
        console.log(error);
        context.dispatch('USER_ME_FAILURE', {error});
        return null;
      });
  },
  update: (context, payload) => {
    context.dispatch('USER_UPDATE_START', null);
    return context
      .api
      .users
      .update(payload)
      .then((responsePayload) => {
        let user = new User(responsePayload.user);
        context.dispatch('USER_UPDATE_SUCCESS', user);
        return user;
      })
      .catch((error) => {
        console.log(error);
        context.dispatch('USER_UPDATE_FAILURE', {error});
        return null;
      });
  },
  sendPasswordResetEmail: (context, payload) => {
    context.dispatch('USER_SEND_PASSWORD_RESET_EMAIL_START', null);
    if(!payload.email || !payload.email.match(/.@./)) {
      let error = new Error('Please enter your email');
      context.dispatch('USER_SEND_PASSWORD_RESET_EMAIL_FAILURE', {error});
      return Promise.resolve(null);
    }
    return context
      .api
      .users
      .sendPasswordResetEmail(payload)
      .then((responsePayload) => {
        context.dispatch('USER_SEND_PASSWORD_RESET_EMAIL_SUCCESS', {});
        return {};
      })
      .catch((error) => {
        console.log(error);
        context.dispatch('USER_SEND_PASSWORD_RESET_EMAIL_FAILURE', {error});
        return null;
      });
  },
  resetPassword: (context, payload) => {
    context.dispatch('USER_RESET_PASSWORD_START', null);
    if(!payload.password) {
      let error = new Error('Please enter a new password');
      context.dispatch('USER_RESET_PASSWORD_FAILURE', {error});
      return Promise.resolve(null);
    }
    if(!payload.password_reset_token) {
      let error = new Error('A token must be provided. Please check the link in your email');
      context.dispatch('USER_RESET_PASSWORD_FAILURE', {error});
      return Promise.resolve(null);
    }
    return context
      .api
      .users
      .resetPassword(payload)
      .then((responsePayload) => {
        context.dispatch('USER_RESET_PASSWORD_SUCCESS', {});
        return {};
      })
      .catch((error) => {
        console.log(error);
        context.dispatch('USER_RESET_PASSWORD_FAILURE', {error});
        return null;
      });
  }
};

export default userActions
