import _ from 'lodash';
import Promise from 'bluebird';

class BaseRepository {
  constructor(ctx) {
    this.db = ctx.providerClients.postgresProviderClient;
    this.queue = ctx.providerClients.bullQueueProviderClient;
  }

  stringifyParamsForUpdate(params) {
    return _.map(params, (val, key) => {
      return `${key} = $${key}`;
    }).join(', ');
  }
}

export default BaseRepository;