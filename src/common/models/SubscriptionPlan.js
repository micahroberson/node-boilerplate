import Base from './Base';

export const Intervals = {
  Day: 'day',
  Week: 'week',
  Month: 'month',
  Year: 'year',
};

const IntervalAbbreviationsMap = {
  day: 'day',
  week: 'wk',
  month: 'mo.',
  year: 'yr',
};

class SubscriptionPlan extends Base {
  constructor(values) {
    super(values);

    this.name = values.name;
    this.interval = values.interval;
    this.amount_in_cents = values.amount_in_cents;
    this.amount_text = values.amount_text; // Client
    this.stripe_plan_id = values.stripe_plan_id;
    this.stripe_plan_object = values.stripe_plan_object;
  }

  get price_per_month_text() {
    return `${this.amount_text} / ${IntervalAbbreviationsMap[this.interval]}`;
  }
}

export default SubscriptionPlan;
