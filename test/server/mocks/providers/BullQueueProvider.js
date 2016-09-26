import Promise from 'bluebird';
import BaseProvider, {BaseProviderClient} from './BaseProvider';

class BullQueueProvider extends BaseProvider {
  acquireClient() {
    return Promise.resolve(new BullQueueProviderClient());
  }
}

class BullQueueProviderClient extends BaseProviderClient {
  process(cb) {
    cb();
  }

  enqueue(jobClass, payload) {
    return Promise.resolve(null);
  }
}

export default BullQueueProvider
