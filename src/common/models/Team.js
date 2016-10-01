import Base from './Base';
import PaymentMethod from './PaymentMethod';
import Subscription from './Subscription';
import User from './User';

class Team extends Base {
  static hasMany() {
    return {
      subscriptions: {
        class: Subscription
      },
      users: {
        class: User
      },
      payment_methods: {
        class: PaymentMethod
      }
    };
  }

  static belongsTo() {
    return {
      primary_user: {
        class: User
      },
      primary_payment_method: {
        class: PaymentMethod
      }
    };
  }

  constructor(values) {
    super(values);

    this.name = values.name;
  }
}

export default Team
