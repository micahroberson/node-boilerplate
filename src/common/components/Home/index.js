import React from 'react';
import {css} from 'aphrodite/no-important';
import User from '../../models/User';
import styles from './styles';

class Home extends React.Component {
  static contextTypes = {
    currentUser: React.PropTypes.instanceOf(User)
  };

  render() {
    let {currentUser} = this.context;
    return (
      <div className={css(styles.Home)}>
        {currentUser ? <h2>Welcome, {currentUser.first_name}</h2> : null}
      </div>
    );
  }
}

export default Home;