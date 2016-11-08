import _ from 'lodash';
import { BaseStore as FluxibleBaseStore } from 'fluxible/addons';
import User from '../models/User';

export const RequestStates = {
  Started: 'started',
  Success: 'success',
  Failure: 'failure'
};

const EventStateToRequestStateMap = {
  START: RequestStates.Started,
  SUCCESS: RequestStates.Success,
  FAILURE: RequestStates.Failure
};

export function registerHandlers(Store) {
  if(!Store.baseEventName) {throw new Error('baseEventName must be defined');}
  for(let event in Store.handlers) {
    let handlerName = Store.handlers[event];
    let matches = event.replace(Store.baseEventName, '').match(/^_(.*)_(START|SUCCESS|FAILURE)$/);
    if(!matches) {
      Store.handlers[event] = Store.prototype[handlerName];
    } else {
      let [t, action, state] = matches;
      let dynamicHandler = `handle${_.upperFirst(_.camelCase(action))}${_.startCase(state.toLowerCase())}`;
      let definedHandler;
      if(handlerName !== 'baseHandler') {
        definedHandler = Store.prototype[handlerName];
      }
      Store.prototype[dynamicHandler] = function baseHandler(payload) {
        this.logEventState(action, EventStateToRequestStateMap[state], (payload ? payload.error : null));
        if(definedHandler) {
          definedHandler.call(this, payload);
        }
        this.emitChange();
      };
      Store.handlers[event] = dynamicHandler;
    }
  }
  return Store;
}

class BaseStore extends FluxibleBaseStore {
  static handlers = {};
  static baseEventName = '';
  static modelClass = null;

  constructor(dispatcher) {
    super(dispatcher);

    this.requestStates = {};
    this.requestErrors = {};
  }

  logEventState(action, state, error) {
    this.requestStates[action] = state;
    this.requestErrors[action] = error;
  }

  getEventData(event) {
    return {
      state: this.requestStates[event],
      error: this.requestErrors[event]
    };
  }

  shouldDehydrate() {
    return true;
  }

  dehydrate() {
    return {
      requestStates: this.requestStates,
      requestErrors: this.requestErrors
    };
  }

  rehydrate(state) {
    this.requestStates = state.requestStates;
    this.requestErrors = state.requestErrors;
  }
}

export default BaseStore;
