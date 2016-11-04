import _ from 'lodash';
import Promise from 'bluebird';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import BaseRepository from './BaseRepository';
import User from '../../common/models/User';
import {ParametersInvalidError} from '../lib/errors/APIError';

class UsersRepository extends BaseRepository {
  static tableName = 'users';
  static modelClass = User;

  findByEmail(email, options={}) {
    return this.find({email}, _.defaults({firstOnly: true}, options));
  }

  create(user) {
    // TODO: Validation
    if(user.password.length < 8) {return Promise.reject(new ParametersInvalidError({message: 'Password is too short. Minimum 8 characters is required.'}));}
    return this._setEncryptedPassword(user)
      .then((user) => {
        return super.create(user)
          .catch((error) => {
            if(error.code === '23505') {
              error = new ParametersInvalidError({message: 'The email address you entered is already in use'});
            }
            throw error;
          });
      });
  }

  update(user, payload) {
    return this._setEncryptedPassword(payload)
      .then((payload) => {
        return super.update(user, payload);
      });
  }

  sendWelcomeEmail(user) {
    let options = {
      templateName: 'basic',
      subject: 'Welcome to Node Boilerplate!',
      to: [{
        email: user.email,
        name: user.name
      }],
      mergeVars: [{
        rcpt: user.email,
        vars: [
          {name: 'body', content: {
            html: `Welcome to Node Boilerplate, please click the link below to verify your email address.`,
            cta: {
              // TODO: Add domains to environment config
              url: `http://localhost:4000/verify-email/${user.email_verification_token}`,
              text: 'Verify'
            }
          }}
        ]
      }]
    };
    return this.mailer.send(options);
  }

  sendResetPasswordEmail(user) {
    let options = {
      templateName: 'basic',
      subject: 'Reset Your Node Boilerplate Password',
      to: [{
        email: user.email,
        name: user.name
      }],
      mergeVars: [{
        rcpt: user.email,
        vars: [
          {name: 'body', content: {
            html: `Hi ${user.first_name},<br/><br/>You may use the link below to set a new password for your Node Boilerplate account. If you did not request a password reset, please ignore this email and your password will remain the same.`,
            cta: {
              // TODO: Add domains to environment config
              url: `http://localhost:4000/reset-password/${user.password_reset_token}`,
              text: 'Reset my password'
            }
          }}
        ]
      }]
    };
    return this.mailer.send(options);
  }

  genUrlSafeBase64(n=32) {
    return crypto.randomBytes(n).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
  }

  _setEncryptedPassword(object) {
    if(!object.password) {return Promise.resolve(object);}
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (error, salt) => {
        if(error) {return reject(error);}
        bcrypt.hash(object.password, salt, (error, encryptedPassword) => {
          if(error) {return reject(error);}
          object.encrypted_password = encryptedPassword;
          delete object.password;
          return resolve(object);
        });
      });
    });
  }

  _serializeUserForSql(user) {
    return {
      id: user.id,
      email: user.email.toLowerCase().trim(),
      name: user.name,
      encrypted_password: user.encrypted_password,
      email_verification_token: user.email_verification_token,
      email_verified_at: user.email_verified_at,
      email_verification_token_sent_at: user.email_verification_token_sent_at,
      password_reset_token: user.password_reset_token,
      password_reset_token_redeemed_at: user.password_reset_token_redeemed_at,
      password_reset_token_sent_at: user.password_reset_token_sent_at,
      permissions: JSON.stringify(_.cloneDeep(user.permissions)),
    };
  }
}

export default UsersRepository
