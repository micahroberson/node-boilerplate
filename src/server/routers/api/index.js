import traverseFiles from '../../lib/traverseFiles';
import BaseApiRouter from './BaseApiRouter';
import bodyParser from 'body-parser';
import RequestContext from '../../lib/RequestContext';

class ApiRouter extends BaseApiRouter {
  static path = '/api';

  setupRoutes(environment) {
    this.routes.use(bodyParser.json());

    this.routes.use((req, res) => {
      console.log('Request: ', req.url);
      req.payload = (req.body && req.body.payload) ? req.body.payload : {};
      let safePayload = Object.assign({}, req.payload);
      if(safePayload.hasOwnProperty('password')) {
        safePayload.password = '********';
      }
      console.log('Request Payload: ', JSON.stringify(safePayload, undefined, 2));
      return environment.createRequestContext().then((ctx) => {
        req.ctx = ctx;
        return 'next';
      });
    });

    // Mount resource routers
    traverseFiles(__dirname, (filename, filePath, stat) => {
      if(filename !== 'index.js' && filename !== 'BaseApiRouter.js') {
        let RouterClass = require(filePath).default;
        let router = new RouterClass(environment);
        this.routes.use(RouterClass.path, router.routes);
      }
    });

    this.routes.use((req, res) => {
      return req.ctx.close()
        .then(() => {
          return 'next';
        });
    });

    // Response Middleware
    this.routes.use((req, res, next) => {
      if(res.payload) {
        let responseJSON = {
          success: true,
          payload: res.payload
        };
        console.log('Response: ', responseJSON);
        return res.json(responseJSON);
      }
      res.status(404);
      res.send('Route not found');
    });

    this.routes.use((error, req, res, next) => {
      req.ctx.close()
        .catch((error) => {
          console.log('Error closing ctx: ', error);
        })
        .finally(() => {
          console.log(error.stack);
          let responseJSON = {
            success: false,
            error: {
              name: error.name,
              message: error.message,
              code: error.code
            }
          };
          console.log('Response: ', responseJSON);
          res.json(responseJSON);
        })
    });
  }
}

export default ApiRouter
