import Promise from 'bluebird';
import Team from '../models/Team';
import {browserHistory} from 'react-router';

const teamActions = {
  create: (context, payload) => {
    context.dispatch('TEAM_CREATE_START', null);
    if(!payload.subscription_plan) {
      let error = new Error('You must select a subscription plan');
      context.dispatch('TEAM_CREATE_FAILURE', {error});
      return Promise.resolve(null);
    }
    return context
      .api
      .teams
      .create(payload)
      .then((responsePayload) => {
        let team = new Team(responsePayload.team);
        context.dispatch('TEAM_CREATE_SUCCESS', team);
        return team;
      })
      .catch((error) => {
        context.dispatch('TEAM_CREATE_FAILURE', {error});
        return null;
      });
  }
};

export default teamActions;
