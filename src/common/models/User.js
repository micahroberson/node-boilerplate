import Base from './Base';

class User extends Base {
  constructor(values) {
    super(values);

    this.name = values.name;
    this.email = values.email;
    this.encrypted_password = values.encrypted_password;
    this.password = values.password; // Not persisted
  }
}

export default User;