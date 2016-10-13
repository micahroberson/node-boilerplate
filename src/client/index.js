import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {createElement} from 'fluxible-addons-react';
import {StyleSheet} from 'aphrodite/no-important';
import app from '../common/app';
import ApiPlugin from '../common/plugins/ApiPlugin';
import ContextProvider from '../common/components/ContextProvider';

app.plug(new ApiPlugin({}));

const dehydratedState = window.App;

StyleSheet.rehydrate(window.cssState);

app.rehydrate(dehydratedState, (error, context) => {
  if(error) {throw error;}
  window.context = context;
  let mountNode = document.getElementById('app');
  let componentContext = context.getComponentContext();
  ReactDOM.render(
    React.createElement(
      ContextProvider,
      {context: componentContext},
      React.createElement(Router, {
        routes: context.getComponent()(componentContext),
        history: browserHistory
      })
    ),
    mountNode
  );
})