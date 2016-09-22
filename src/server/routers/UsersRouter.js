import Router from 'express-promise-router';
import RequestContext from '../lib/RequestContext';
import UsersController from '../controllers/UsersController';
import {controllerActionHandler} from './handlers';

const UsersRouter = new Router();

UsersRouter.post('/sign-in', controllerActionHandler(UsersController.signIn));
UsersRouter.post('/', controllerActionHandler(UsersController.create));
UsersRouter.post('/me', RequestContext.authorize, controllerActionHandler(UsersController.me));
UsersRouter.post('/update', RequestContext.authorize, controllerActionHandler(UsersController.update));

export default UsersRouter;