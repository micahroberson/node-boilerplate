import Promise from 'bluebird';
import Subscription, {SubscriptionStatuses} from '../../common/models/Subscription';
import {beginTransaction, commitTransaction, rollbackTransaction} from './helpers';
import {serializeSubscriptionPlan} from './subscriptionPlansController';
import {ParametersInvalidError, UnauthorizedAccessError} from '../lib/errors/APIError';

const TrialPeriodLengthInDays = 30;

const subscriptionsController = {
  create(ctx, payload) {
    let subscription = new Subscription({
      team_id: payload.team_id,
      subscription_plan_id: payload.subscription_plan_id, // Optional
      status: SubscriptionStatuses.Trialing, // Default. Will be overridden by Stripe response if pertinent
    });
    if(!payload.subscription_plan_id) {
      // NOTE: Setting trial period if no susbcription_plan_id provided
      let trialPeriodEnd = new Date();
      trialPeriodEnd.setDate(trialPeriodEnd.getDate() + TrialPeriodLengthInDays);
      Object.assign(subscription, {
        current_period_start: new Date(),
        current_period_end: trialPeriodEnd,
      });
    }
    let assignExistingSubscriptions = (subscription) => {
      return ctx.subscriptionsRepository.assignManyTo(subscription.team)
        .return(subscription);
    };
    let createSubscription = (subscription) => {
      // Note: Only allowing single Active/Trialing subscription to be created for now
      if(subscription.team.subscriptions.find(s => s.status === SubscriptionStatuses.Active || s.status === SubscriptionStatuses.Trialing)) {return Promise.reject(new ParametersInvalidError({message: 'Team has existing subscription.'}));}
      return ctx.subscriptionsRepository.create(subscription);
    };
    return beginTransaction.call(ctx)
      .then(assignSerializationDependencies.bind(ctx, subscription))
      .then(assignExistingSubscriptions)
      .then(createSubscription)
      .bind(ctx)
      .then(commitTransaction)
      .catch(rollbackTransaction)
      .then(assignSerializationDependencies)
      .then(serializeResponse);
  },

  update(ctx, payload) {
    let assignExistingSubscriptions = (subscription) => {
      return ctx.subscriptionsRepository.assignManyTo(subscription.team)
        .return(subscription);
    };
    let updateSubscription = (subscription) => {
      return ctx.subscriptionsRepository.update(subscription, payload);
    };
    return ctx.subscriptionsRepository.findById(payload.id)
      .bind(ctx)
      .then(assignSerializationDependencies)
      .then(assignExistingSubscriptions)
      .then(updateSubscription)
      .then(assignSerializationDependencies)
      .then(serializeResponse);
  },

  subscription(ctx, payload) {
    return ctx.subscriptionsRepository.findById(payload.id)
      .bind(ctx)
      .then(assignSerializationDependencies)
      .then(serializeResponse);
  },
};

export default subscriptionsController;

// Note: should be called with 'ctx' context
function assignSerializationDependencies(subscription) {
  if(!subscription) {return null;}
  let assignTeam = (subscription) => {
    return this.teamsRepository.assignTo(subscription);
  };
  let assignSubscriptionPlan = (subscription) => {
    return this.subscriptionPlansRepository.assignTo(subscription);
  };
  return assignTeam(subscription)
    .then(assignSubscriptionPlan);
}

function serializeResponse(subscriptions) {
  if(!Array.isArray(subscriptions)) {
    return {subscription: serializeSubscription(subscriptions)};
  }
  return {subscriptions: subscriptions.map(sp => serializeSubscription(sp))};
}

export function serializeSubscription(subscription) {
  return {
    id: subscription.id,
    status: subscription.status,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    subscription_plan: subscription.subscription_plan ? serializeSubscriptionPlan(subscription.subscription_plan) : null,
  };
}
