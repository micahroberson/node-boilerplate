function UserAgentPlugin() {
  return {
    name: 'UserAgentPlugin',
    plugContext: function plugContext(contextOptions, context) {
      var userAgent = contextOptions.userAgent;
      if(userAgent) {
        userAgent.isiOs = userAgent.isiPad || userAgent.isiPhone || userAgent.isiPod;
        userAgent.isMobile = userAgent.isMobile && !userAgent.isTablet;
      }
      let getUserAgent = () => {
        return userAgent;
      };

      // context.getUserAgent = getUserAgent;

      return {
        plugActionContext: function(actionContext) {
          actionContext.getUserAgent = getUserAgent;
        },
        plugComponentContext: function(componentContext) {
          componentContext.getUserAgent = getUserAgent;
        },
        dehydrate: function dehydrate() {
          return {
            userAgent: contextOptions.userAgent
          };
        },
        rehydrate: function rehydrate(state) {
          userAgent = state.userAgent;
        }
      };
    }
  };
}

export default UserAgentPlugin;
