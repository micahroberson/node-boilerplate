import Base from './Base';
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
      }
    };
  }

  static belongsTo() {
    return {
      billing_user: {
        class: User
      }
    };
  }

  constructor(values) {
    super(values);

    this.name = values.name;
  }
}

export default Team
