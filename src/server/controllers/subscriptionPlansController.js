import Promise from 'bluebird';
import SubscriptionPlan from '../../common/models/SubscriptionPlan';
import {ParametersInvalidError, UnauthorizedAccessError} from '../lib/errors/APIError';

const subscriptionPlansController = {
  create(ctx, payload) {
    let subscriptionPlan = new SubscriptionPlan({
      amount_in_cents: payload.amount_in_cents,
      interval: payload.interval,
      name: payload.name,
    });
    return ctx.subscriptionPlansRepository.create(subscriptionPlan)
      .then(serializeResponse);
  },

  list(ctx, payload) {
    return ctx.subscriptionPlansRepository.find()
      .then(serializeResponse);
  },
};

export default subscriptionPlansController;

function serializeResponse(subscriptionPlans) {
  if(!Array.isArray(subscriptionPlans)) {
    return {subscription_plan: serializeSubscriptionPlan(subscriptionPlans)};
  }
  return {subscription_plans: subscriptionPlans.map(sp => serializeSubscriptionPlan(sp))};
}

export function serializeSubscriptionPlan(subscriptionPlan) {
  return {
    id: subscriptionPlan.id,
    name: subscriptionPlan.name,
    interval: subscriptionPlan.interval,
    amount_in_cents: subscriptionPlan.amount_in_cents,
  };
}
