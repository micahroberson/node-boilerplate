import _ from 'lodash';
import Promise from 'bluebird';
import BaseRepository from './BaseRepository';
import Team from '../../common/models/Team';

class TeamRepository extends BaseRepository {
  static tableName = 'teams';
  static modelClass = Team;

  _serializeSubscriptionPlanForSql(team) {
    return {
      id: team.id,
      name: team.name,
      billing_user_id: team.billing_user_id
    };
  }
}

export default TeamRepository
