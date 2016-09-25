import Promise from 'bluebird';

class BullQueueProvider {
  connect() {
    return Promise.resolve(null);
  }

  disconnect() {
    return Promise.resolve(null);
  }

  acquireClient() {
    return Promise.resolve(new BullQueueProviderClient());
  }
}

class BullQueueProviderClient {
  close() {
    return Promise.resolve(null);
  }

  process(cb) {
    cb();
  }

  enqueue(jobClass, payload) {
    return Promise.resolve(null);
  }
}

export default BullQueueProvider