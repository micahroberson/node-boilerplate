import Router from 'express-promise-router';
import RequestContext from '../lib/RequestContext';
import usersController from '../controllers/usersController';
import {controllerActionHandler} from './handlers';

const usersRouter = new Router();

usersRouter.post('/sign-in', controllerActionHandler(usersController.signIn));
usersRouter.post('/create', controllerActionHandler(usersController.create));
usersRouter.post('/me', RequestContext.authorize, controllerActionHandler(usersController.me));
usersRouter.post('/update', RequestContext.authorize, controllerActionHandler(usersController.update));

export default usersRouter;