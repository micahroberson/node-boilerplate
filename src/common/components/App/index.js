import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import UserStore from '../../stores/UserStore';
import User from '../../models/User';
import Navigation from '../Navigation';

class App extends React.Component {
  static contextTypes = {
    getStore: React.PropTypes.func,
    executeAction: React.PropTypes.func
  };

  static childContextTypes = {
    currentUser: React.PropTypes.instanceOf(User)
  };

  getChildContext() {
    return {
      currentUser: this.props.currentUser
    };
  }

  render() {
    return (
      <div>
        <Navigation currentUser={this.props.currentUser} />
        {this.props.children}
      </div>
    );
  }
}

App = connectToStores(App, [UserStore], (context, props) => {
  return {
    currentUser: context.getStore(UserStore).getCurrentUser()
  };
});

export default App