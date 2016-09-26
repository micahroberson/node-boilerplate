import Promise from 'bluebird';

class BaseProvider {
  connect() {
    return Promise.resolve(null);
  }

  disconnect() {
    return Promise.resolve(null);
  }

  acquireClient() {
    throw new Error('Must be implemented');
  }
}

class BaseProviderClient {
  close() {
    return Promise.resolve(null);
  }
}

export {BaseProviderClient};
export default BaseProvider;
