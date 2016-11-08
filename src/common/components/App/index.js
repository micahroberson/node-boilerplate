import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import UsersStore from '../../stores/UsersStore';
import TeamsStore from '../../stores/TeamsStore';
import User from '../../models/User';
import Team from '../../models/Team';
import Navigation from '../Navigation';

class App extends React.Component {
  render() {
    // console.log('CONTEXT 1: ', this.context);
    // console.log('PROPS 1: ', this.props);
    return (
      <div>
        <Navigation currentUser={this.props.currentUser} />
        {this.props.children}
      </div>
    );
  }
}

App = connectToStores(App, [UsersStore, TeamsStore], (context, props) => {
  return {
    currentUser: context.getStore(UsersStore).getCurrentUser(),
    currentTeam: context.getStore(TeamsStore).getCurrentTeam()
  };
});

export default App;
