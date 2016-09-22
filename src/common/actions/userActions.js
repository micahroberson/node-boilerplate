import User from '../models/User';
import {browserHistory} from 'react-router';

const userActions = {
  signIn: (context, payload) => {
    context.dispatch('USER_SIGN_IN_START', null);
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
  }
};

export default userActions
