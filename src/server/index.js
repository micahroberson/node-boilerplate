import express from 'express';
import toureiro from 'toureiro';
import appRouter from './routers/app';
import ApiRouter from './routers/api';
import Environment from './config/Environment';
import providers from './providers';

let environment = new Environment();
environment.load(providers)
  .then(() => {
    const server = express();

    server.disable('x-powered-by');

    let apiRouter = new ApiRouter(environment);
    server.use('/api', apiRouter.routes);
    server.use('/toureiro', toureiro());
    server.use(appRouter);

    server.listen(environment.config.PORT, () => {
      console.log('listening on port: %s', environment.config.PORT);
    });
  })
  .catch((error) => {
    throw error;
  });
