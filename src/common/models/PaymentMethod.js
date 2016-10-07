import Base from './Base';
import Team from './Team';

class PaymentMethod extends Base {
  static belongsTo() {
    return {
      team: {
        class: Team
      }
    };
  };

  constructor(values) {
    super(values);

    this.brand = values.brand;
    this.last_four = values.last_four;
    this.expiration_month = values.expiration_month;
    this.expiration_year = values.expiration_year;
    this.stripe_card_id = values.stripe_card_id;
    this.stripe_card_object = values.stripe_card_object;

    this.stripe_token_id = values.stripe_token_id; // Not persisted
  }
}

export default PaymentMethod
