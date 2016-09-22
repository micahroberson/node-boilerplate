import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import UserStore from '../stores/UserStore';
import User from '../models/User';

class Provider extends React.Component {
  static childContextTypes = {
    currentUser: React.PropTypes.instanceOf(User)
  };

  getChildContext() {
    return {
      currentUser: this.props.currentUser
    };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

Provider = connectToStores(Provider, [UserStore], (context, props) => {
  return {
    currentUser: context.getStore(UserStore).getCurrentUser()
  };
});

export default Provider
