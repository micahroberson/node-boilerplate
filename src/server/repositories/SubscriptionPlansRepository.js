import _ from 'lodash';
import Promise from 'bluebird';
import BaseRepository from './BaseRepository';
import SubscriptionPlan from '../../common/models/SubscriptionPlan';

class SubscriptionPlansRepository extends BaseRepository {
  static tableName = 'subscription_plans';
  static modelClass = SubscriptionPlan;

  _serializeSubscriptionPlanForSql(subscriptionPlan) {
    return {
      id: subscriptionPlan.id,
      name: subscriptionPlan.name,
      interval: subscriptionPlan.interval,
      amount_in_cents: subscriptionPlan.amount_in_cents,
      stripe_plan_id: subscriptionPlan.stripe_plan_id,
      stripe_plan_object: JSON.stringify(_.cloneDeep(subscriptionPlan.stripe_plan_object))
    };
  }
}

export default SubscriptionPlansRepository
