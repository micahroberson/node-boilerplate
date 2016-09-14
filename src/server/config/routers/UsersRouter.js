import Router from 'express-promise-router';
import RequestContext from '../../lib/RequestContext';
import UsersController from '../../controllers/UsersController';

const UsersRouter = new Router();

let handler = (action) => {
  return (req, res) => {
    return action(req.ctx, Object.assign(req.params, req.payload))
      .then((responseJSON) => {
        req.responseJSON = responseJSON;
        return 'next';
      });
  };
};

UsersRouter.post('/sign-in', handler(UsersController.signIn));
UsersRouter.post('/', handler(UsersController.create));
UsersRouter.put('/:id', RequestContext.authorize, handler(UsersController.update));
UsersRouter.get('/:id', RequestContext.authorize, handler(UsersController.user));

export default UsersRouter;