import Promise from 'bluebird';
import BaseRepository from './BaseRepository';
import UserSession from '../../shared/models/UserSession';
import ParametersInvalidError from '../lib/errors/ParametersInvalidError';

class UserSessionsRepository extends BaseRepository {
  findbyId(id) {
    return this.db().then((db) => {
      return db.pquery(`SELECT * FROM user_sessions WHERE id=$id`, {id})
        .then((records) => {
          db.release();
          if(!records.length) {return null;}
          let userSession = new UserSession(records[0]);
          return userSession;
        })
        .catch((error) => {
          if(db.release) {
            db.release();
          }
          throw error;
        });
    });
  }

  create(userSession) {
    // TODO: Validation
    if(!userSession.user_id) {return Promise.reject(new ParametersInvalidError({message: 'UserSession must have a user_id fk.'}));}
    return this.db().then((db) => {
      return db.pquery(`INSERT INTO user_sessions (id, user_id, expires_at) VALUES ($id, $user_id, $expires_at) RETURNING *`, this._serializeUserSessionForSQL(userSession))
        .then((records) => {
          return new UserSession(records[0]);
        });
    });
  }

  _serializeUserSessionForSQL(userSession) {
    return {
      id: userSession.id,
      user_id: userSession.user_id,
      expires_at: userSession.expires_at
    };
  }
}

export default UserSessionsRepository;