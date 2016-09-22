import { BaseStore } from 'fluxible/addons';
import User from '../models/User';

export const RequestStates = {
  'Started': 'started',
  'Success': 'success',
  'Failure': 'failure'
};

class UserStore extends BaseStore {
  static storeName = 'UserStore';
  static handlers = {
    'USER_SIGN_IN_START': 'handleSignInStart',
    'USER_SIGN_IN_SUCCESS': 'handleSignInSuccess',
    'USER_SIGN_IN_FAILURE': 'handleSignInFailure',
    'USER_SIGN_UP_START': 'handleSignUpStart',
    'USER_SIGN_UP_SUCCESS': 'handleSignUpSuccess',
    'USER_SIGN_UP_FAILURE': 'handleSignUpFailure',
    'USER_ME_START': 'handleMeStart',
    'USER_ME_SUCCESS': 'handleMeSuccess',
    'USER_ME_FAILURE': 'handleMeFailure',
  };

  constructor(dispatcher) {
    super(dispatcher);

    this.currentUser = null;
    this.requestStates = {};
    this.requestErrors = {};
  }

  logEventState(event, state, payload) {
    let error = payload ? payload.error : null;
    this.requestStates[event] = state;
    this.requestErrors[event] = error;
    this.emitChange();
  }

  handleSignInStart() {
    this.logEventState('SIGN_IN', RequestStates.Started);
  }

  handleSignInSuccess(user) {
    this.currentUser = user;
    this.logEventState('SIGN_IN', RequestStates.Success);
  }

  handleSignInFailure(data) {
    console.log(data.error);
    this.logEventState('SIGN_IN', RequestStates.Failure, data);
  }

  handleSignUpStart() {
    this.logEventState('SIGN_UP', RequestStates.Started);
  }

  handleSignUpSuccess(user) {
    this.currentUser = user;
    this.logEventState('SIGN_UP', RequestStates.Success);
  }

  handleSignUpFailure(data) {
    console.log(data.error);
    this.logEventState('SIGN_UP', RequestStates.Failure, data);
  }

  handleMeStart() {
    this.logEventState('ME', RequestStates.Started);
  }

  handleMeSuccess(user) {
    this.currentUser = user;
    this.logEventState('ME', RequestStates.Success);
  }

  handleMeFailure(data) {
    console.log(data.error);
    this.logEventState('ME', RequestStates.Failure, data);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getEventData(event) {
    return {
      state: this.requestStates[event],
      error: this.requestErrors[event]
    };
  }

  dehydrate() {
    return {
      currentUser: this.currentUser
    };
  }

  rehydrate(state) {
    this.currentUser = state.currentUser ? new User(state.currentUser) : null;
  }
}

export default UserStore;