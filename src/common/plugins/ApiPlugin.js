import ApiClient from '../lib/ApiClient';

function ApiPlugin(options) {
  options = options || {};
  var api = new ApiClient(options);
  return {
    name: 'ApiPlugin',
    plugContext: function plugContext() {

      return {
        plugActionContext: function plugActionContext(actionContext) {
          actionContext.api = api;
        },
        plugComponentContext: function plugComponentContext(componentContext) {
          componentContext.api = api;
        },
        plugStoreContext: function plugStoreContext(storeContext) {
          storeContext.api = api;
        },
        dehydrate: function() {
          return {
            session_token: api.getSessionToken()
          };
        },
        rehydrate: function(state) {
          api.setSessionToken(state.session_token);
        }
      };
    }
  };
}

export default ApiPlugin;