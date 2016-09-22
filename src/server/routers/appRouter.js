import express from 'express';
import Promise from 'bluebird';
import serialize from 'serialize-javascript';
import CookieDough from 'cookie-dough';
import cookieParser from 'cookie-parser';
import navigateAction from '../../common/actions/navigateAction';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import React from 'react';
import app from '../../common/app.js';
import Html from '../../common/components/Html';
import ApiPlugin from '../../common/plugins/ApiPlugin';
import userActions from '../../common/actions/userActions';
import {FluxibleComponent} from 'fluxible-addons-react';
import {match, RouterContext} from 'react-router';
import {StyleSheetServer} from 'aphrodite';

const appRouter = express.Router();

appRouter.use(cookieParser());

appRouter.get('/sign-out', (req, res, next) => {
  let cookie = new CookieDough(req);
  cookie.remove('st');
  return res.redirect('/');
});

let fetchUser = (context, sessionToken, cb) => {
  if(!sessionToken) {return cb();}
  context.executeAction(userActions.me, {}, cb);
};

appRouter.get('*', (req, res, next) => {
  console.log('Request: ', req.url);
  match({
    routes: app.getComponent(),
    location: req.url
  }, (error, redirectLocation, renderProps) => {
    if(error) {return res.status(500).send(error.message);}
    if(redirectLocation) {return res.redirect(302, redirectLocation.pathname + redirectLocation.search);}
    if(!renderProps) {return res.status(404).send('Not found');}

    let cookie = new CookieDough(req);
    app.plug(new ApiPlugin({
      req: req,
      sessionToken: cookie.get('st')
    }));

    let context = app.createContext();
    fetchUser(context, cookie.get('st'), () => {
      context.executeAction(navigateAction, {path: req.url}, () => {
        let exposed = `window.App=${serialize(app.dehydrate(context))};`;
        let markupElement = React.createElement(
          FluxibleComponent,
          {context: context.getComponentContext()},
          React.createElement(RouterContext, renderProps)
        );
        let {html, css} = StyleSheetServer.renderStatic(() => {
          return renderToString(markupElement);
        });
        let htmlProps = {
          context: context.getComponentContext(),
          state: exposed,
          css: css,
          markup: html
        };
        let fullMarkup = renderToStaticMarkup(<Html {...htmlProps} />);
        res.status(200).send(fullMarkup);
      });
    });
  });
});

export default appRouter;