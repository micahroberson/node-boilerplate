import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {FluxibleComponent, createElement} from 'fluxible-addons-react';
import {StyleSheet} from 'aphrodite/no-important';
import app from '../common/app';
import ApiPlugin from '../common/plugins/ApiPlugin';

app.plug(new ApiPlugin({}));

const dehydratedState = window.App;

StyleSheet.rehydrate(window.cssState);

app.rehydrate(dehydratedState, (error, context) => {
  if(error) {throw error;}
  window.context = context;
  let mountNode = document.getElementById('app');
  ReactDOM.render(
    React.createElement(
      FluxibleComponent,
      {context: context.getComponentContext()},
      React.createElement(Router, {
        routes: context.getComponent(),
        history: browserHistory
      })
    ),
    mountNode
  );
})