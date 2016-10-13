import React from 'react';
import User from '../../models/User';
import Team from '../../models/Team';

class ContextProvider extends React.Component {
  static propTypes = {
    context: React.PropTypes.object.isRequired
  };

  static childContextTypes = {
    currentUser: React.PropTypes.instanceOf(User),
    currentTeam: React.PropTypes.instanceOf(Team),
    getStore: React.PropTypes.func.isRequired,
    getUserAgent: React.PropTypes.func.isRequired,
    executeAction: React.PropTypes.func.isRequired
  };

  getChildContext() {
    return {
      currentUser: this.props.currentUser,
      currentTeam: this.props.currentTeam,
      getStore: this.props.context.getStore,
      getUserAgent: this.props.context.getUserAgent,
      executeAction: this.props.context.executeAction
    };
  }

  render () {
    return React.cloneElement(this.props.children, {
      context: this.props.context
    });
  }
}

export default ContextProvider;
