import _ from 'lodash';
import Promise from 'bluebird';
import BaseRepository from './BaseRepository';
import Subscription, {SubscriptionStatuses} from '../../common/models/Subscription';

function unixTimestampToDate(timestamp) {
  if(!timestamp) {return null;}
  return new Date(timestamp * 1000);
}

class SubscriptionsRepository extends BaseRepository {
  static tableName = 'subscriptions';
  static modelClass = Subscription;

  // NOTE: Should be called within a transaction
  // TODO: Ensure *only* called within a trasaction via nested tx's
  create(subscription) {
    return super.create(subscription)
      .then((subscription) => {
        if(subscription.status === SubscriptionStatuses.Trialing && subscription.current_period_end > (new Date())) {
          return subscription;
        }
        return this._createStripeSubscription(subscription);
      });
  }

  update(subscription, payload) {
    if(payload.subscription_plan_id) {
      let findSubscriptionPlan = () => {
        return this.ctx.subscriptionPlansRepository.findById(payload.subscription_plan_id);
      };
      if(payload.subscription_plan_id === subscription.subscription_plan_id) {
        throw new Error('Subscription is already assigned to the plan provided');
      }
      // If currently trialing, and updating to paid
      if(!subscription.subscription_plan && subscription.status === SubscriptionStatuses.Trialing) {
        // Note: Assuming 'id' and 'subscription_plan_id'
        if(Object.keys(payload).length > 2) {throw new Error('When updating subscription_plan, no other attributes may be updated simultaneously.');}
        return findSubscriptionPlan()
          .then((subscriptionPlan) => {
            subscription.subscription_plan = subscriptionPlan;
            return this._createStripeSubscription(subscription);
          });
      }
      return findSubscriptionPlan()
        .then((subscriptionPlan) => {
          let stripeSubscriptionParams = {
            plan: subscriptionPlan.stripe_plan_id,
            prorate: false, // TODO: Allow/handle prorated changes via receipts
          };
          return this.stripe.subscriptions.update(subscription.stripe_subscription_id, stripeSubscriptionParams)
        })
        .then((stripeSubscriptionObject) => {
          return super.update(subscription, {
            ...this._extractRelevantFieldsFromStripeSubscriptionObject(stripeSubscriptionObject),
            subscription_plan_id: payload.subscription_plan_id,
          });
        });
    }
    return super.update(subscription, payload);
  }

  assignManyTo(...args) {
    return super.assignManyTo(...args)
      .then((entity) => {
        // Sort subsriptions for each
        entity.subscriptions = _.sortBy(entity.subscriptions, (subscription) => {
          if(subscription.status === SubscriptionStatuses.Active || subscription.status === SubscriptionStatuses.Trialing) {
            return 0;
          }
          return subscription.created_at.getTime();
        });
        return entity;
      });
  }

  _createStripeSubscription(subscription) {
    if(!subscription.team) {throw new Error('Subscription must have team assigned.');}
    if(!subscription.team.primary_payment_method_id) {throw new Error('Team must have a primary payment method.');}
    if(!subscription.subscription_plan) {throw new Error('Subscription must have subscription_plan assigned.');}
    return this.stripe.subscriptions.create({
      customer: subscription.team.stripe_customer_id,
      plan: subscription.subscription_plan.stripe_plan_id,
    }).then((stripeSubscriptionObject) => {
      let updatePayload = this._extractRelevantFieldsFromStripeSubscriptionObject(stripeSubscriptionObject);
      return this.update(subscription, updatePayload);
    });
  }

  _extractRelevantFieldsFromStripeSubscriptionObject(stripeSubscriptionObject) {
    return {
      status: stripeSubscriptionObject.status,
      current_period_start: unixTimestampToDate(stripeSubscriptionObject.current_period_start),
      current_period_end: unixTimestampToDate(stripeSubscriptionObject.current_period_end),
      stripe_subscription_id: stripeSubscriptionObject.id,
      stripe_subscription_object: stripeSubscriptionObject,
    };
  }

  _serializeSubscriptionForSql(subscription) {
    return {
      id: subscription.id,
      team_id: subscription.team_id,
      subscription_plan_id: subscription.subscription_plan_id,
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      stripe_subscription_id: subscription.stripe_subscription_id,
      stripe_subscription_object: JSON.stringify(_.cloneDeep(subscription.stripe_subscription_object))
    };
  }
}

export default SubscriptionsRepository
