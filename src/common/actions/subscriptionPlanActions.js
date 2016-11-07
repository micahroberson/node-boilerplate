import Promise from 'bluebird';
import SubscriptionPlan from '../models/SubscriptionPlan';
import SubscriptionPlansStore from '../stores/SubscriptionPlansStore';

const subscriptionPlanActions = {
  list: (context, payload) => {
    let requestPayload = Object.assign({
      pagination: SubscriptionPlansStore.defaultPagination,
      filters: [],
      sorter: null,
    }, payload);
    context.dispatch('SUBSCRIPTION_PLAN_LIST_START', requestPayload);
    return context
      .api
      .subscriptionPlans
      .list(requestPayload)
      .then((responsePayload) => {
        let subscriptionPlans = responsePayload.subscription_plans.map(sp => new SubscriptionPlan(sp));
        context.dispatch('SUBSCRIPTION_PLAN_LIST_SUCCESS', {
          entities: subscriptionPlans,
          sorter: requestPayload.sorter,
          filters: requestPayload.filters,
          pagination: requestPayload.pagination,
        });
        return subscriptionPlans;
      })
      .catch((error) => {
        context.dispatch('SUBSCRIPTION_PLAN_LIST_FAILURE', {error});
        return null;
      });
  },
};

export default subscriptionPlanActions;
