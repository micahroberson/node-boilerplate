import express from 'express';
import toureiro from 'toureiro';
import AppRouter from './routers/app';
import ApiRouter from './routers/api';
import WebhooksRouter from './routers/webhooks';
import Environment from './config/Environment';
import providers from './providers';

let environment = new Environment();
environment.load(providers)
  .then(() => {
    const server = express();

    server.disable('x-powered-by');

    let apiRouter = new ApiRouter(environment);
    let appRouter = new AppRouter(environment);
    let webhooksRouter = new WebhooksRouter(environment);

    server.use('/api', apiRouter.routes);
    server.use('/webhooks', webhooksRouter.routes);
    server.use('/toureiro', toureiro());
    server.use(appRouter.routes);

    server.listen(environment.config.PORT, () => {
      console.log('listening on port: %s', environment.config.PORT);
    });
  })
  .catch((error) => {
    throw error;
  });
