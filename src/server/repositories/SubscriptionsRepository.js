import _ from 'lodash';
import Promise from 'bluebird';
import BaseRepository from './BaseRepository';
import Subscription from '../../common/models/Subscription';

class SubscriptionsRepository extends BaseRepository {
  static tableName = 'subscriptions';
  static modelClass = Subscription;

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
