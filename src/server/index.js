import express from 'express';
import AppRouter from './routers/AppRouter';
import ApiRouter from './routers/ApiRouter';

const Port = parseInt(process.env.PORT);
const server = express();

server.disable('x-powered-by');

server.use('/api', ApiRouter);
server.use(AppRouter);

server.listen(Port, () => {
  console.log('listening on port: %s', Port);
});
