import Promise from 'bluebird';
import Subscription from '../models/Subscription';
import SubscriptionsStore from '../stores/SubscriptionsStore';

const subscriptionActions = {
  fetch: (context, payload) => {
    context.dispatch('SUBSCRIPTION_FETCH_START', null);
    return context
      .api
      .subscriptions
      .subscription(payload)
      .then(instantiateSubscription)
      .then((subscription) => {
        context.dispatch('SUBSCRIPTION_FETCH_SUCCESS', subscription);
      })
      .catch((error) => {
        context.dispatch('SUBSCRIPTION_FETCH_FAILURE', {error});
        return null;
      });
  },
  update: (context, payload) => {
    context.dispatch('SUBSCRIPTION_UPDATE_START', null);
    return context
      .api
      .subscriptions
      .update(payload)
      .then(instantiateSubscription)
      .then((subscription) => {
        context.dispatch('SUBSCRIPTION_UPDATE_SUCCESS', subscription);
      })
      .catch((error) => {
        context.dispatch('SUBSCRIPTION_UPDATE_FAILURE', {error});
        return null;
      });
  },
};

function instantiateSubscription(responsePayload) {
  return new Subscription(responsePayload.subscription);
}

export default subscriptionActions;
