import React from 'react';
import {Link} from 'react-router';
import {css} from 'aphrodite/no-important';
import User from '../../models/User';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import UserMenuPopover from '../UserMenuPopover';
import styles from './styles';
import logo from '../../images/logo.png';
import logo2x from '../../images/logo@2x.png';
import logo3x from '../../images/logo@3x.png';

class Navigation extends React.Component {
  static propTypes = {
    currentUser: React.PropTypes.instanceOf(User)
  };

  shouldComponentUpdate = shouldComponentUpdatePure;

  render() {
    let {currentUser} = this.props;
    let links = [];
    if(currentUser) {
      let userMenuPopoverProps = {currentUser};
      links.push(
        <li className={css(styles.link)} key="userlink"><UserMenuPopover {...userMenuPopoverProps} /></li>
      );
    } else {
      links.push(
        <li className={css(styles.link)} key="signin"><Link to="/sign-in">Sign in / Sign up</Link></li>
      );
    }
    return (
      <nav className={css(styles.navigation)}>
        <div className={css(styles.innerContainer)}>
          <Link className={css(styles.homeLink)} to="/">
            <img className={css(styles.logo)} src={logo} srcSet={`${logo2x} 2x, ${logo3x} 3x`} alt="Node Boilerplate" />
          </Link>
          <ul className={css(styles.links)}>
            {links}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navigation
