import Resource from '../Resource';

class Users extends Resource {
  constructor(opts) {
    super(opts);

    this.create = Resource.createEndpoint({
      authRequired: false,
      path: '/users/create',
      method: 'POST'
    });

    this.signIn = Resource.createEndpoint({
      authRequired: false,
      path: '/users/sign-in',
      method: 'POST'
    });

    this.me = Resource.createEndpoint({
      authRequired: true,
      path: '/users/me',
      method: 'POST'
    });

    this.update = Resource.createEndpoint({
      authRequired: true,
      path: '/users/update',
      method: 'POST'
    });

    this.sendPasswordResetEmail = Resource.createEndpoint({
      authRequired: false,
      path: '/users/send-password-reset-email',
      method: 'POST'
    });

    this.resetPassword = Resource.createEndpoint({
      authRequired: false,
      path: '/users/reset-password',
      method: 'POST'
    });
  }
}

export default Users