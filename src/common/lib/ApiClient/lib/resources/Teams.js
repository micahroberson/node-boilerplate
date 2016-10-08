import Resource from '../Resource';

class Teams extends Resource {
  constructor(opts) {
    super(opts);

    this.create = Resource.createEndpoint({
      authRequired: true,
      path: '/teams/create',
      method: 'POST'
    });

    this.team = Resource.createEndpoint({
      authRequired: true,
      path: '/teams/team',
      method: 'POST'
    });

    this.addPaymentMethod = Resource.createEndpoint({
      authRequired: true,
      path: '/teams/add-payment-method',
      method: 'POST'
    });
  }
}

export default Teams;
