import React from 'react';
import {IndexRoute, Route} from 'react-router';
import App from './App';
import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';

const routes = (
  <Route path="/" component={App}>
    <Route path="/sign-in" component={SignIn} />
    <Route path="/sign-up" component={SignUp} />
    <IndexRoute component={Home} />
  </Route>
);

export default routes;