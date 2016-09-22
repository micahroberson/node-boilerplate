import Base from './Base';

class User extends Base {
  constructor(values) {
    super(values);

    this.name = values.name;
    this.email = values.email;
    this.encrypted_password = values.encrypted_password;
    this.password = values.password; // Not persisted
  }

  get first_name() {
    let name = this.name || '';
    let fname = name.substr(0, name.indexOf(' '));
    fname = fname || name;
    return fname;
  }
}

export default User;