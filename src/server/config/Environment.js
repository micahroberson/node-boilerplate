import _ from 'lodash';
import Promise from 'bluebird';
import providers from '../providers';
import RequestContext from '../lib/RequestContext';

const env = process.env.NODE_ENV;
const config = require(`./environments/${env}`).default;

class Environment {
  constructor() {
    this.providers = {};
    this.config = config;
    this.env = env;
  }

  load(providers) {
    return Promise.all(_.map(providers, (ProviderClass, providerName) => {
      let provider = new ProviderClass(config);
      this.providers[_.lowerFirst(providerName)] = provider;
      return provider.connect();
    }));
  }

  createRequestContext() {
    return Promise.all(_.map(this.providers, (provider, providerName) => {
      return provider.acquireClient();
    })).then((providerClients) => {
      providerClients = _.reduce(providerClients, (map, providerClient) => {
        map[_.lowerFirst(providerClient.constructor.name)] = providerClient;
        return map;
      }, {});
      return new RequestContext({providerClients});
    });
  }
}

export default Environment
