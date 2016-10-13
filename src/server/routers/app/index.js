import Promise from 'bluebird';
import express from 'express';
import useragent from 'express-useragent';
import serialize from 'serialize-javascript';
import CookieDough from 'cookie-dough';
import cookieParser from 'cookie-parser';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import React from 'react';
import app from '../../../common/app.js';
import Html from '../../../common/components/Html';
import ApiPlugin from '../../../common/plugins/ApiPlugin';
import teamActions from '../../../common/actions/teamActions';
import userActions from '../../../common/actions/userActions';
import {FluxibleComponent} from 'fluxible-addons-react';
import ContextProvider from '../../../common/components/ContextProvider';
import {match, RouterContext} from 'react-router';
import {StyleSheetServer} from 'aphrodite';

class AppRouter {
  constructor(environment) {
    this.routes = new express.Router();
    this.setupRoutes(environment);
  }

  setupRoutes(environment) {
    this.routes.use(cookieParser());
    this.routes.use(useragent.express());

    this.routes.get('/sign-out', (req, res, next) => {
      let cookie = new CookieDough(req);
      cookie.remove('st');
      return res.redirect('/');
    });

    let fetchUserAndTeam = (context, sessionToken) => {
      if(!sessionToken) {return Promise.resolve();}
      return Promise.all([
        context.executeAction(userActions.me, {}),
        context.executeAction(teamActions.team, {})
      ]);
    };

    this.routes.get('*', (req, res, next) => {
      console.log('Request: ', req.url);

      if(environment.env === 'development') {
        // See server.js
        webpackIsomorphicTools.refresh();
      }

      let cookie = new CookieDough(req);
      app.plug(new ApiPlugin({
        req: req,
        sessionToken: cookie.get('st')
      }));

      let context = app.createContext({userAgent: req.useragent});
      let componentContext = context.getComponentContext();
      fetchUserAndTeam(context, cookie.get('st')).then(() => {
        match({
          routes: app.getComponent()(componentContext),
          location: req.url
        }, (error, redirectLocation, renderProps) => {
          if(error) {return res.status(500).send(error.message);}
          if(redirectLocation) {return res.redirect(302, redirectLocation.pathname + redirectLocation.search);}
          if(!renderProps) {return res.status(404).send('Not found');}

          let exposed = `window.App=${serialize(app.dehydrate(context))};`;
          let markupElement = React.createElement(
            ContextProvider,
            {context: componentContext},
            React.createElement(RouterContext, renderProps)
          );
          let {html, css} = StyleSheetServer.renderStatic(() => {
            return renderToString(markupElement);
          });
          let htmlProps = {
            context: componentContext,
            state: exposed,
            css: css,
            markup: html
          };
          let fullMarkup = renderToStaticMarkup(<Html {...htmlProps} />);
          res.status(200).send(fullMarkup);
        });
      })
      .catch((error) => {
        next(error);
      });
    });
  }
}

export default AppRouter
