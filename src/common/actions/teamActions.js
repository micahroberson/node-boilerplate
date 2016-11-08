import Promise from 'bluebird';
import Team from '../models/Team';
import {browserHistory} from 'react-router';

const teamActions = {
  create: (context, payload) => {
    context.dispatch('TEAM_CREATE_START', null);
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
  },
  team: (context, payload) => {
    context.dispatch('TEAM_TEAM_START', null);
    return context
      .api
      .teams
      .team({})
      .then((responsePayload) => {
        let team = null;
        if(responsePayload.team) {
          team = new Team(responsePayload.team);
        }
        context.dispatch('TEAM_TEAM_SUCCESS', team);
        return team;
      })
      .catch((error) => {
        // console.log(error);
        context.dispatch('TEAM_TEAM_FAILURE', {error});
        return null;
      });
  },
  addPaymentMethod: (context, payload) => {
    context.dispatch('TEAM_ADD_PAYMENT_METHOD_START', null);
    return context
      .api
      .teams
      .addPaymentMethod(payload)
      .then((responsePayload) => {
        let team = null;
        if(responsePayload.team) {
          team = new Team(responsePayload.team);
        }
        context.dispatch('TEAM_ADD_PAYMENT_METHOD_SUCCESS', team);
        return team;
      })
      .catch((error) => {
        context.dispatch('TEAM_ADD_PAYMENT_METHOD_FAILURE', {error});
        return null;
      });
  },
  update: (context, payload) => {
    context.dispatch('TEAM_UPDATE_START', null);
    return context
      .api
      .teams
      .update(payload)
      .then((responsePayload) => {
        let team = null;
        if(responsePayload.team) {
          team = new Team(responsePayload.team);
        }
        context.dispatch('TEAM_UPDATE_SUCCESS', team);
        return team;
      })
      .catch((error) => {
        context.dispatch('TEAM_UPDATE_FAILURE', {error});
        return null;
      });
  },
};

export default teamActions;
