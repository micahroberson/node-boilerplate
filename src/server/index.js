import express from 'express';
import appRouter from './routers/appRouter';
import apiRouter from './routers/apiRouter';

const Port = parseInt(process.env.PORT);
const server = express();

server.disable('x-powered-by');

server.use('/api', apiRouter);
server.use(appRouter);

server.listen(Port, () => {
  console.log('listening on port: %s', Port);
});
