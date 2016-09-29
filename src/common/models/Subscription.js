import Base from './Base';
import Team from './Team';
import SubscriptionPlan from './SubscriptionPlan';

class Subscription extends Base {
  static belongsTo() {
    return {
      team: {
        class: Team
      },
      subscription_plan: {
        class: SubscriptionPlan
      }
    };
  };

  constructor(values) {
    super(values);

    this.status = values.status;
    this.current_period_start = values.current_period_start;
    this.current_period_end = values.current_period_end;
    this.stripe_subscription_id = values.stripe_subscription_id;
    this.stripe_subscription_object = values.stripe_subscription_object;
  }
}

export default Subscription
