import Promise from 'bluebird';
import express from 'express';
import bodyParser from 'body-parser';
import RequestContext from '../../lib/RequestContext';
import stripeWebhooksController from '../../controllers/webhooks/stripeController';

class WebhooksRouter {
  static path = '/webhooks';

  constructor(environment) {
    this.routes = new express.Router();
    this.setupRoutes(environment);
  }

  setupRoutes(environment) {
    let attachRequestContext = (req, res, next) => {
      return environment.createRequestContext()
        .then((ctx) => {
          req.ctx = ctx;
          next();
          return null;
        });
    };

    this.routes.use(bodyParser.json());
    this.routes.use(attachRequestContext);

    this.routes.post('/stripe/customers/updated', stripeWebhooksController.updateCustomer);

    this.routes.use((req, res, next) => {
      return req.ctx.close()
        .then(() => {
          // TODO: Support controller-action response
          res.status(200).send('OK');
          return null;
        })
        .catch(next);
    });

    this.routes.use(errorHandler);
  }
}

export default WebhooksRouter

let errorHandler = (error, req, res, next) => {
  return req.ctx.close()
    .catch((error) => {console.log('Error closing ctx: ', error);})
    .finally(() => {
      return res.status(error.code || 500).send(error.message);
    });
};
