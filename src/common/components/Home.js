import React from 'react';
import User from '../models/User';

class Home extends React.Component {
  static contextTypes = {
    currentUser: React.PropTypes.instanceOf(User)
  };

  render() {
    let {currentUser} = this.context;
    return (
      <div>
        {currentUser ? <p>Welcome, {currentUser.name}</p> : null}
      </div>
    );
  }
}

export default Home;