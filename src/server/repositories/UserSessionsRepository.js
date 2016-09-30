import Promise from 'bluebird';
import crypto from 'crypto';
import BaseRepository from './BaseRepository';
import UserSession from '../../common/models/UserSession';
import {ParametersInvalidError} from '../lib/errors/APIError';

class UserSessionsRepository extends BaseRepository {
  static tableName = 'user_sessions';
  static modelClass = UserSession;

  create(userSession) {
    // TODO: Validation
    if(!userSession.user_id) {return Promise.reject(new ParametersInvalidError({message: 'UserSession must have a user_id fk.'}));}
    if(!userSession.id) {
      userSession.id = crypto.randomBytes(32).toString('base64');
    }
    return super.create(userSession);
  }

  _serializeUserSessionForSql(userSession) {
    return {
      id: userSession.id,
      user_id: userSession.user_id,
      expires_at: userSession.expires_at
    };
  }
}

export default UserSessionsRepository;