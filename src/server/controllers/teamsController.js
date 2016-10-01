import _ from 'lodash';
import Promise from 'bluebird';
import Team from '../../common/models/Team';
import {serializeUser} from './usersController';
import {serializeSubscription} from './subscriptionsController';
import {ParametersInvalidError, UnauthorizedAccessError} from '../lib/errors/APIError';

const teamsController = {
  create(ctx, payload) {
    
  },

  team(ctx, payload) {
    return ctx.teamsRepository.findById(payload.id)
      .bind(ctx)
      .then(assignSerializationDependencies)
      .then(serializeResponse);
  },

  addPaymentMethod(ctx, payload) {
    let beginTransaction = (team) => {
      return ctx.providerClients.postgresProviderClient
        .transaction()
        .return(team);
    };
    let commit = (team) => {
      return ctx.providerClients.postgresProviderClient
        .commit()
        .return(team);
    };
    let rollback = (error) => {
      return ctx.providerClients.postgresProviderClient
        .rollback()
        .return(error);
    };
    let createPaymentMethod = (team) => {
      let paymentMethod = new PaymentMethod(payload.payment_method);
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

    return ctx.teamsRepository.findById(payload.id)
      .then(beginTransaction)
      .then(createPaymentMethod)
      .then(setPrimaryPaymentMethod)
      .then(commit)
      .catch(rollback)
      .then(assignSerializationDependencies)
      .then(serializeResponse);
  }
};

export default teamsController;

// Note: should be called with 'ctx' context
function assignSerializationDependencies(team) {
  return this.paymentMethodsRepository.assignManyTo(team)
    .then(this.subscriptionsRepository.assignManyTo)
    .then(this.usersRepository.assignManyTo);
}

function serializeResponse(team) {
  return {team: serializeTeam(team)};
}

export function serializeTeam(team) {
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
