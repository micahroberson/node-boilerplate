import React from 'react';
import {Link} from 'react-router';
import {StyleSheet, css} from 'aphrodite/no-important';
import User from '../models/User';
import shouldComponentUpdatePure from '../lib/shouldComponentUpdatePure';
import colors from '../lib/colors';

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

const styles = StyleSheet.create({
  navigation: {
    padding: '15px 30px',
    fontSize: '14px',
    borderBottom: '1px solid rgba(0,0,0,0.15)'
  },
  homeLink: {
    display: 'inline-block',
    width: 200,
    fontWeight: 700,
    fontSize: 18,
    color: colors.jellyBean
  },
  links: {
    display: 'inline-block',
    width: 'calc(100% - 200px)',
    textAlign: 'right'
  },
  link: {
    display: 'inline-block'
  }
});
