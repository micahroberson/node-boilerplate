import Base from './Base';
import User from './User';

class UserSession extends Base {
  static belongsTo() {
    return {
      user: {
        class: User
      }
    };
  }

  constructor(values) {
    super(values);

    this.expires_at = values.expires_at;
  }
}

export default UserSession;