import Resource from '../Resource';

class Subscriptions extends Resource {
  constructor(opts) {
    super(opts);

    this.update = Resource.createEndpoint({
      authRequired: true,
      path: '/subscriptions/update',
      method: 'POST'
    });

    this.subscription = Resource.createEndpoint({
      authRequired: true,
      path: '/subscriptions/subscription',
      method: 'POST'
    });
  }
}

export default Subscriptions;
