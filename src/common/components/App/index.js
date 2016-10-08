import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import UsersStore from '../../stores/UsersStore';
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

App = connectToStores(App, [UsersStore], (context, props) => {
  return {
    currentUser: context.getStore(UsersStore).getCurrentUser()
  };
});

export default App;
