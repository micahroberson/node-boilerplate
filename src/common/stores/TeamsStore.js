import BaseStore, {registerHandlers} from './BaseStore';
import Team from '../models/Team';

class TeamsStore extends BaseStore {
  static storeName = 'TeamsStore';
  static baseEventName = 'TEAM';
  static handlers = {
    'TEAM_CREATE_START'   : 'baseHandler',
    'TEAM_CREATE_SUCCESS' : 'setCurrentTeam',
    'TEAM_CREATE_FAILURE' : 'baseHandler'
  };

  constructor(dispatcher) {
    super(dispatcher);

    this.currentTeam = null;
  }

  setCurrentTeam(team) {
    this.currentTeam = team;
  }

  getCurrentTeam() {
    return this.currentTeam;
  }

  dehydrate() {
    return Object.assign(super.dehydrate(), {
      currentTeam: this.currentTeam
    });
  }

  rehydrate(state) {
    super.rehydrate(state);
    this.currentTeam = state.currentTeam ? new Team(state.currentTeam) : null;
  }
}

TeamsStore = registerHandlers(TeamsStore);

export default TeamsStore;
