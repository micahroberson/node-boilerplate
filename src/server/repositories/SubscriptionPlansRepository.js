import _ from 'lodash';
import crypto from 'crypto';
import Promise from 'bluebird';
import BaseRepository from './BaseRepository';
import SubscriptionPlan from '../../common/models/SubscriptionPlan';

class SubscriptionPlansRepository extends BaseRepository {
  static tableName = 'subscription_plans';
  static modelClass = SubscriptionPlan;

  create(subscriptionPlan) {
    return this.stripe.plans.create({
      amount: subscriptionPlan.amount_in_cents,
      interval: subscriptionPlan.interval,
      name: subscriptionPlan.name,
      currency: 'usd',
      id: `${_.snakeCase(subscriptionPlan.name)}_${crypto.randomBytes(6).toString('base64').toLowerCase()}`,
    }).then((stripePlanObject) => {
      subscriptionPlan.stripe_plan_id = stripePlanObject.id;
      subscriptionPlan.stripe_plan_object = stripePlanObject;
      return super.create(subscriptionPlan);
    });
  }

  _serializeSubscriptionPlanForSql(subscriptionPlan) {
    return {
      id: subscriptionPlan.id,
      name: subscriptionPlan.name,
      interval: subscriptionPlan.interval,
      amount_in_cents: subscriptionPlan.amount_in_cents,
      stripe_plan_id: subscriptionPlan.stripe_plan_id,
      stripe_plan_object: JSON.stringify(_.cloneDeep(subscriptionPlan.stripe_plan_object)),
    };
  }
}

export default SubscriptionPlansRepository
