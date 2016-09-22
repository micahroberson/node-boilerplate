import React from 'react';
import {css} from 'aphrodite/no-important';
import {Link} from 'react-router';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import User from '../../models/User';
import Popover from '../Popover';
import styles from './styles';

class UserMenuPopover extends React.Component {
  static propTypes = {
    currentUser: React.PropTypes.instanceOf(User)
  };

  shouldComponentUpdate = shouldComponentUpdatePure;

  constructor(props) {
    super(props);

    this.state = {isOpen: false};
  }

  handleOnBodyClick(e) {
    this.setState({isOpen: false});
  }

  handleOnClickButton(e) {
    this.setState({isOpen: true});
  }

  handleOnClickLink() {
    this.setState({isOpen: false});
  }

  renderBody() {
    let settingsLinkProps = {
      className: css(styles.link),
      to: '/settings',
      onClick: this.handleOnClickLink.bind(this)
    };
    return (
      <ul className={css(styles.list)}>
        <li className={css(styles.listElement)}>
          <Link {...settingsLinkProps}>Settings</Link>
        </li>
        <li className={css(styles.listElement)}>
          <a className={css(styles.link)} href="/sign-out">Sign out</a>
        </li>
      </ul>
    );
  }

  render() {
    let {isOpen} = this.state;
    let {currentUser} = this.props;
    let popoverProps = {
      isOpen,
      body: this.renderBody(),
      onBodyClick: this.handleOnBodyClick.bind(this)
    };
    let buttonProps = {
      className: css(styles.button),
      onClick: this.handleOnClickButton.bind(this)
    };
    return (
      <Popover {...popoverProps}>
        <button {...buttonProps}>Hi {currentUser.first_name}</button>
      </Popover>
    );
  }
}

export default UserMenuPopover
