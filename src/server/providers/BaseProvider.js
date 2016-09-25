class BaseProvider {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  connect() {
    throw new Error('Must be implemented');
  }

  disconnect() {
    throw new Error('Must be implemented');
  }

  acquireClient() {
    throw new Error('Must be implemented');
  }
}

export class BaseProviderClient {
  constructor() {}

  close() {
    throw new Error('Must be implemented');
  }
}

export default BaseProvider
