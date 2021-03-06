import _ from 'lodash';
import Promise from 'bluebird';
import PaymentMethod from '../../common/models/PaymentMethod';
import Team from '../../common/models/Team';
import {serializeUser} from './usersController';
import {ParametersInvalidError, UnauthorizedAccessError} from '../lib/errors/APIError';

const teamsController = {
  create(ctx, payload) {
    // NOTE: this creates a team for the current user
    if(ctx.session.user.team_id) {
      return Promise.reject(new ParametersInvalidError('User already belongs to a team'));
    }
    let createTeam = () => {
      let team = new Team(payload);
      team.primary_user_id = ctx.session.user.id;
      team.primary_user = ctx.session.user;
      return ctx.teamsRepository.create(team);
    };
    let createStripeCustomerForTeam = (team) => {
      return ctx.teamsRepository.createStripeCustomer(team);
    };
    let setTeamIdOnUser = (team) => {
      return ctx.usersRepository.update(ctx.session.user, {team_id: team.id})
        .return(team);
    }
    return beginTransaction.call(ctx)
      .then(createTeam)
      .then(createStripeCustomerForTeam)
      .then(setTeamIdOnUser)
      .bind(ctx)
      .then(commitTransaction)
      .catch(rollbackTransaction)
      .then(assignSerializationDependencies)
      .then(serializeResponse);
  },

  team(ctx, payload) {
    // Returns the team for the current user
    return ctx.teamsRepository.findById(ctx.session.user.team_id)
      .bind(ctx)
      .then(assignSerializationDependencies)
      .then(serializeResponse);
  },

  addPaymentMethod(ctx, payload) {
    if(!ctx.session.user.team_id) {
      return Promise.reject(new ParametersInvalidError('User does not belong to a team'));
    }
    let createPaymentMethod = (team) => {
      let paymentMethod = new PaymentMethod({stripe_token_id: payload.stripe_token_id});
      paymentMethod.team_id = team.id;
      paymentMethod.team = team;
      return ctx.paymentMethodsRepository.create(paymentMethod);
    };
    let setPrimaryPaymentMethod = (paymentMethod) => {
      if(!!paymentMethod.team.primary_payment_method_id) {
        return paymentMethod.team;
      }
      return ctx.teamsRepository.update(
        paymentMethod.team,
        {primary_payment_method_id: paymentMethod.id}
      );
    };

    return ctx.teamsRepository.findById(ctx.session.user.team_id)
      .bind(ctx)
      .then(beginTransaction)
      .then(createPaymentMethod)
      .then(setPrimaryPaymentMethod)
      .then(commitTransaction)
      .catch(rollbackTransaction)
      .then(assignSerializationDependencies)
      .then(serializeResponse);
  }
};

export default teamsController;

// Note: should be called with 'ctx' context
function assignSerializationDependencies(team) {
  if(!team) {return null;}
  let assignPaymentMethods = (team) => {
    return this.paymentMethodsRepository.assignManyTo(team);
  };
  let assignSubscriptions = (team) => {
    return this.subscriptionsRepository.assignManyTo(team);
  };
  let assignUsers = (team) => {
    return this.usersRepository.assignManyTo(team);
  };
  return assignPaymentMethods(team)
    .then(assignSubscriptions)
    .then(assignUsers);
}
function beginTransaction(team) {
  return this.providerClients.postgresProviderClient
    .transaction()
    .return(team);
}
function commitTransaction(team) {
  return this.providerClients.postgresProviderClient
    .commit()
    .return(team);
}
function rollbackTransaction(error) {
  return this.providerClients.postgresProviderClient
    .rollback()
    .then(() => {
      throw error;
    });
}

function serializeResponse(team) {
  return {team: serializeTeam(team)};
}

export function serializeTeam(team) {
  if(!team) {return null;}
  let json = {
    id: team.id,
    name: team.name,
    primary_payment_method_id: team.primary_payment_method_id,
    primary_user_id: team.primary_user_id
  };
  if(team.subscriptions && team.subscriptions.length) {
    json.subscription = serializeSubscription(team.subscriptions[0]);
  }
  if(team.payment_methods) {
    json.payment_methods = team.payment_methods.map(pm => serializePaymentMethod(pm));
  }
  if(team.users) {
    json.users = team.users.map(u => serializeUser(u));
  }
  return json;
}

export function serializePaymentMethod(paymentMethod) {
  return {
    id: paymentMethod.id,
    brand: paymentMethod.brand,
    last_four: paymentMethod.last_four,
    expiration_month: paymentMethod.expiration_month,
    expiration_year: paymentMethod.expiration_year
  };
}

export function serializeSubscription(subscription) {
  return {
    id: subscription.id,
    status: subscription.status,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end
  };
}
