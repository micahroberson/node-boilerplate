import BaseApiRouter from './BaseApiRouter';
import usersController from '../../controllers/usersController';

class UsersRouter extends BaseApiRouter {
  static path = '/users';

  setupRoutes(environment) {
    this.routes.post('/sign-in', this.controllerActionHandler(usersController.signIn));
    this.routes.post('/create', this.controllerActionHandler(usersController.create));
    this.routes.post('/me', this.authorize, this.controllerActionHandler(usersController.me));
    this.routes.post('/update', this.authorize, this.controllerActionHandler(usersController.update));
  }
}

export default UsersRouter
