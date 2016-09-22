import Resource from '../Resource';

class Users extends Resource {
  constructor(opts) {
    super(opts);

    this.create = Resource.createEndpoint({
      authRequired: false,
      path: '/users',
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
  }
}

export default Users