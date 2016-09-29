import BaseStore, {registerHandlers} from './BaseStore';
import User from '../models/User';

class UserStore extends BaseStore {
  static storeName = 'UserStore';
  static baseEventName = 'USER';
  static handlers = {
    'USER_SIGN_IN_START': 'baseHandler',
    'USER_SIGN_IN_SUCCESS': 'setCurrentUser',
    'USER_SIGN_IN_FAILURE': 'baseHandler',
    'USER_SIGN_UP_START': 'baseHandler',
    'USER_SIGN_UP_SUCCESS': 'setCurrentUser',
    'USER_SIGN_UP_FAILURE': 'baseHandler',
    'USER_ME_START': 'baseHandler',
    'USER_ME_SUCCESS': 'setCurrentUser',
    'USER_ME_FAILURE': 'baseHandler',
    'USER_UPDATE_START': 'baseHandler',
    'USER_UPDATE_SUCCESS': 'setCurrentUser',
    'USER_UPDATE_FAILURE': 'baseHandler',
    'USER_SEND_PASSWORD_RESET_EMAIL_START': 'baseHandler',
    'USER_SEND_PASSWORD_RESET_EMAIL_SUCCESS': 'baseHandler',
    'USER_SEND_PASSWORD_RESET_EMAIL_FAILURE': 'baseHandler',
    'USER_RESET_PASSWORD_START': 'baseHandler',
    'USER_RESET_PASSWORD_SUCCESS': 'baseHandler',
    'USER_RESET_PASSWORD_FAILURE': 'baseHandler',
  };

  constructor(dispatcher) {
    super(dispatcher);

    this.currentUser = null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  dehydrate() {
    return Object.assign(super.dehydrate(), {
      currentUser: this.currentUser
    });
  }

  rehydrate(state) {
    super.rehydrate(state);
    this.currentUser = state.currentUser ? new User(state.currentUser) : null;
  }
}

UserStore = registerHandlers(UserStore);

export default UserStore;