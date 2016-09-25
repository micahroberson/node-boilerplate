import BaseProvider, {BaseProviderClient} from './BaseProvider';
import BullQueue from 'bull';

class BullQueueProvider extends BaseProvider {
  connect() {
    return new Promise((resolve, reject) => {
      this.bullQueue = BullQueue('default', this.config.REDIS_URL, {})
        .on('ready', () => {
          console.log('BullQueue ready');
          resolve(null);
        })
        .on('error', (error) => {
          console.log('BullQueue error: ', error);
          reject(error);
        })
        .on('failed', (error) => {
          console.log('BullQueue Job failed: ', error);
        });;
    });
  }

  disconnect() {
    return this.bullQueue.close()
      .then(() => {
        this.bullQueue = null;
        return(null);
      });
  }

  acquireClient() {
    return Promise.resolve(new BullQueueProviderClient(this.bullQueue));
  }
}

class BullQueueProviderClient extends BaseProviderClient {
  constructor(bullQueue) {
    super();
    this.client = bullQueue;
    this.process = this.client.process.bind(this.client);
  }

  close() {
    this.client = null;
    return Promise.resolve(null);
  }

  enqueue(jobClass, payload) {
    return this.client.add({payload, job_class: jobClass});
  //   return new Promise((resolve, reject) => {
  //     queue
  //       .add({payload, job_class: jobClass})
  //       .then(() => {
  //         resolve(null);
  //       })
  //       .catch((error) => {
  //         // reject(error);
  //         // Just log it
  //         console.log(`Error adding to queue: `, error);
  //         console.log(error.stack);
  //         resolve(null);
  //       });
  //   });
  }
}

export default BullQueueProvider
