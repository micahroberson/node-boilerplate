import _ from 'lodash';

class BaseRepository {
  constructor(ctx) {
    this.db = ctx.providerClients.postgresProviderClient;
    this.queue = ctx.providerClients.bullQueueProviderClient;
    this.mailer = ctx.providerClients.mailerProviderClient;
  }

  stringifyParamsForUpdate(params) {
    return _.map(params, (val, key) => {
      return `${key} = $${key}`;
    }).join(', ');
  }
}

export default BaseRepository;