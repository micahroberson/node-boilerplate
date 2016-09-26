import Base from './Base';

class User extends Base {
  constructor(values) {
    super(values);

    this.name = values.name;
    this.email = values.email;

    this.encrypted_password = values.encrypted_password;
    this.password = values.password; // Not persisted
    this.email_verification_token = values.email_verification_token;
    this.email_verification_token_sent_at = values.email_verification_token_sent_at;
    this.email_verified_at = values.email_verified_at;
    this.password_reset_token = values.password_reset_token;
    this.password_reset_token_sent_at = values.password_reset_token_sent_at;
    this.password_reset_token_redeemed_at = values.password_reset_token_redeemed_at;
  }

  get first_name() {
    let name = this.name || '';
    let fname = name.substr(0, name.indexOf(' '));
    fname = fname || name;
    return fname;
  }
}

export default User;