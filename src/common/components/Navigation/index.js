import React from 'react';
import {Link} from 'react-router';
import {css} from 'aphrodite/no-important';
import User from '../../models/User';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import styles from './styles';

class Navigation extends React.Component {
  static propTypes = {
    currentUser: React.PropTypes.instanceOf(User)
  };

  shouldComponentUpdate = shouldComponentUpdatePure;

  render() {
    let {currentUser} = this.props;
    let links = [];
    if(currentUser) {
      links.push(
        <li className={css(styles.link)} key="signout"><a href="/sign-out">Sign out</a></li>
      );
    } else {
      links.push(
        <li className={css(styles.link)} key="signin"><Link to="/sign-in">Sign in / Sign up</Link></li>
      );
    }
    return (
      <nav className={css(styles.navigation)}>
        <Link className={css(styles.homeLink)} to="/">Node Boilerplate</Link>
        <ul className={css(styles.links)}>
          {links}
        </ul>
      </nav>
    );
  }
}

export default Navigation
