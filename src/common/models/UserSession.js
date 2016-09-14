import crypto from 'crypto';
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

    if(!this.id) {
      this.id = crypto.randomBytes(32).toString('base64');
    }
    this.expires_at = values.expires_at;
  }
}

export default UserSession;