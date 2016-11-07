import BaseStore, {registerHandlers} from './BaseStore';
import Subscription from '../models/Subscription';

class SubscriptionsStore extends BaseStore {
  static storeName = 'SubscriptionsStore';
  static baseEventName = 'SUBSCRIPTION';
  static modelClass = Subscription;
  static handlers = {
    'SUBSCRIPTION_SUBSCRIPTION_START'   : 'baseHandler',
    'SUBSCRIPTION_SUBSCRIPTION_SUCCESS' : 'setCurrentSubscription',
    'SUBSCRIPTION_SUBSCRIPTION_FAILURE' : 'baseHandler',
    'SUBSCRIPTION_UPDATE_START'         : 'baseHandler',
    'SUBSCRIPTION_UPDATE_SUCCESS'       : 'setCurrentSubscription',
    'SUBSCRIPTION_UPDATE_FAILURE'       : 'baseHandler',
    'TEAM_CREATE_SUCCESS'               : 'setSubscriptionFromTeam',
    'TEAM_TEAM_SUCCESS'                 : 'setSubscriptionFromTeam',
    'TEAM_ADD_PAYMENT_METHOD_SUCCESS'   : 'setSubscriptionFromTeam',
    'TEAM_UPDATE_SUCCESS'               : 'setSubscriptionFromTeam',
  };

  constructor(dispatcher) {
    super(dispatcher);

    this.currentSubscription = null;
  }

  setSubscriptionFromTeam(team) {
    this.currentSubscription = team.primary_subscription;
    this.emitChange();
  }

  setCurrentSubscription(subscription) {
    this.currentSubscription = subscription;
  }

  getCurrentSubscription() {
    return this.currentSubscription;
  }

  dehydrate() {
    return Object.assign(super.dehydrate(), {
      currentSubscription: this.currentSubscription
    });
  }

  rehydrate(state) {
    super.rehydrate(state);
    this.currentSubscription = state.currentSubscription ? new Subscription(state.currentSubscription) : null;
  }
}

SubscriptionsStore = registerHandlers(SubscriptionsStore);

export default SubscriptionsStore;