import React from 'react';
import {IndexRoute, Route} from 'react-router';
import UserStore from '../stores/UserStore';
import App from './App';
import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Settings from './Settings';

let routes = (componentContext) => {
  let requireAuthentication = (nextState, replace) => {
    if(!componentContext.getStore(UserStore).getCurrentUser()) {
      replace('/sign-in');
    }
  };
  let getWrapperComponent = (Handler) => {
    return (props) => {
      let currentUser = componentContext.getStore(UserStore).getCurrentUser();
      return <Handler currentUser={currentUser} {...props} />;
    }
  };
  return (
    <Route path="/" component={App}>
      <Route path="/sign-in" component={SignIn} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/settings" component={getWrapperComponent(Settings)} onEnter={requireAuthentication}/>
      <IndexRoute component={Home} />
    </Route>
  );
}

export default routes;