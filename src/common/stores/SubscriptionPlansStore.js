import {registerHandlers} from './BaseStore';
import PaginatedStore from './PaginatedStore';
import SubscriptionPlan from '../models/SubscriptionPlan';

class SubscriptionPlansStore extends PaginatedStore {
  static storeName = 'SubscriptionPlansStore';
  static baseEventName = 'SUBSCRIPTION_PLAN';
  static modelClass = SubscriptionPlan;
  static defaultPagination = {offset: 0, limit: 10};
  static handlers = {
    'SUBSCRIPTION_PLAN_LIST_START'   : 'listEntitiesStart',
    'SUBSCRIPTION_PLAN_LIST_SUCCESS' : 'listEntitiesSuccess',
    'SUBSCRIPTION_PLAN_LIST_FAILURE' : 'baseHandler',
  };

  getSubscriptionPlans() {
    return this.orderedEntities;
  }
}

SubscriptionPlansStore = registerHandlers(SubscriptionPlansStore);

export default SubscriptionPlansStore;
