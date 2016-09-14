import _ from 'lodash';
import Promise from 'bluebird';
import bcrypt from 'bcrypt';
import BaseRepository from './BaseRepository';
import User from '../../common/models/User';
import ParametersInvalidError from '../lib/errors/ParametersInvalidError';

let errorHandler = (error) => {
  if(db.release) {
    db.release();
  }
  throw error;
};

class UsersRepository extends BaseRepository {
  findbyId(id) {
    return this.db().then((db) => {
      return db.pquery(`SELECT * FROM users WHERE id=$id`, {id})
        .then((records) => {
          db.release();
          if(!records.length) {return null;}
          let user = new User(records[0]);
          return user;
        })
        .catch(errorHandler);
    });
  }

  findbyIds(ids) {
    return this.db().then((db) => {
      return db.pquery(`SELECT * FROM users WHERE id=ANY($ids)`, {ids})
        .then((records) => {
          db.release();
          return records.map((r) => {return new User(r);});
        })
        .catch(errorHandler)
    })
  }

  findbyEmail(email) {
    email = email.toLowerCase().trim();
    return this.db().then((db) => {
      return db.pquery(`SELECT * FROM users WHERE email=$email`, {email})
        .then((records) => {
          db.release();
          if(!records.length) {return null;}
          let user = new User(records[0]);
          return user;
        })
        .catch(errorHandler);
    });
  }

  create(user) {
    // TODO: Validation
    if(user.password.length < 8) {return Promise.reject(new ParametersInvalidError({message: 'Password is too short. Minimum 8 characters is required.'}));}
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (error, salt) => {
        if(error) {return reject(error);}
        bcrypt.hash(user.password, salt, (error, encryptedPassword) => {
          if(error) {return reject(error);}
          user.encrypted_password = encryptedPassword;
          return resolve(user);
        });
      });
    }).then((user) => {
      return this.db().then((db) => {
        return db.pquery(`INSERT INTO users (email, name, encrypted_password) VALUES ($email, $name, $encrypted_password) RETURNING *`, this._serializeUserForSQL(user))
          .then((records) => {
            return new User(records[0]);
          });
      });
    });
  }

  update(user, payload) {
    return this.db().then((db) => {
      let params = _.pick(payload, ['name', 'email']);
      let strParams = this.stringifyParamsForUpdate(params);
      // TODO: allow password updates
      return db.pquery(`UPDATE users SET ${strParams} WHERE id=$id RETURNING *`, {
        id: user.id,
        ...params
        })
        .then((records) => {
          return new User(records[0]);
        });
    });
  }

  assignToObjects(objects) {
    let wasArray = true;
    if(!Array.isArray(objects)) {
      objects = [objects];
      wasArray = false;
    }
    let userIds = objects.map((obj) => {return obj.user_id;});
    return this.findbyIds(userIds)
      .then((users) => {
        let usersByIdMap = users.reduce((map, user) => {
          map[user.id] = user;
          return map;
        }, {});
        objects.forEach((obj) => {
          obj.user = usersByIdMap[obj.user_id];
        });
        if(!wasArray) {
          return objects[0];
        }
        return objects;
      });
  }

  _serializeUserForSQL(user) {
    return {
      email: user.email.toLowerCase().trim(),
      name: user.name,
      encrypted_password: user.encrypted_password
    };
  }
}

export default UsersRepository;