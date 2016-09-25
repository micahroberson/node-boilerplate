import _ from 'lodash';
import Promise from 'bluebird';
import repositories from '../../repositories';

class RequestContext {
  constructor({providerClients}) {
    this.session = null;
    this.providerClients = providerClients;
    this._initializeRepositories();
  }

  _initializeRepositories() {
    for(let repoName in repositories) {
      let repoClass = repositories[repoName];
      let instanceName = _.lowerFirst(repoName);
      this[instanceName] = new repoClass(this);
    }
    return null;
  }

  close() {
    return Promise.all(_.map(this.providerClients, (providerClient) => {
      return providerClient.close();
    }));
  }
}

export default RequestContext
