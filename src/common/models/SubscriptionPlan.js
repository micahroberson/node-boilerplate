import Base from './Base';

export const Intervals = {
  Day: 'day',
  Week: 'week',
  Month: 'month',
  Year: 'year'
};

class SubscriptionPlan extends Base {
  constructor(values) {
    super(values);

    this.name = values.name;
    this.interval = values.interval;
    this.amount_in_cents = values.amount_in_cents;
    this.stripe_plan_id = values.stripe_plan_id;
    this.stripe_plan_object = values.stripe_plan_object;
  }
}

export default SubscriptionPlan
