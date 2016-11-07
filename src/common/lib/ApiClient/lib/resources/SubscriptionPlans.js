import Resource from '../Resource';

class SubscriptionPlans extends Resource {
  constructor(opts) {
    super(opts);

    this.list = Resource.createEndpoint({
      authRequired: false,
      path: '/subscription-plans/list',
      method: 'POST'
    });
  }
}

export default SubscriptionPlans;
