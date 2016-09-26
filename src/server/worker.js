import Promise from 'bluebird';
import Environment from './config/Environment';
import jobs from './jobs';
import providers from './providers';

let environment = new Environment();
environment.load(providers)
  .then(() => {
    return environment.createRequestContext()
      .then((ctx) => {
        console.log('Starting worker...');
        return ctx.providerClients.bullQueueProviderClient.process((job) => {
          console.log('Processing...');
          if(!jobs[job.data.job_class]) {
            return Promise.reject(new Error(`Job class not found "${job.data.job_class}"`));
          }
          return new jobs[job.data.job_class]({ctx})
            .perform(job.data.payload);
        });
      });
  }).catch((error) => {
    console.log(error);
  });;

