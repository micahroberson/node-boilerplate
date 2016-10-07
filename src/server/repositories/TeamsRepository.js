import _ from 'lodash';
import Promise from 'bluebird';
import BaseRepository from './BaseRepository';
import Team from '../../common/models/Team';

class TeamsRepository extends BaseRepository {
  static tableName = 'teams';
  static modelClass = Team;

  createStripeCustomer(team) {
    return this.stripe.customers.create({
      description: team.name,
      metadata: {
        name: team.name,
        team_id: team.id
      }
    }).then((stripeCustomerObject) => {
      team.stripe_customer_id = stripeCustomerObject.id;
      return this.db.query(`
        UPDATE teams
        SET stripe_customer_id = $stripeCustomerId
        WHERE id = $id
      `, {
        id: team.id,
        stripeCustomerId: team.stripe_customer_id
      })
      .return(team);
    });
  }

  _serializeTeamForSql(team) {
    return {
      id: team.id,
      name: team.name,
      primary_user_id: team.primary_user_id
    };
  }
}

export default TeamsRepository
