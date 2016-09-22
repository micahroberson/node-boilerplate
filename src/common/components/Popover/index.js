import React from 'react';
import ReactDOM from 'react-dom';
import {css} from 'aphrodite/no-important';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import styles from './styles';

class Popover extends React.Component {
  static propTypes = {
    body: React.PropTypes.node.isRequired,
    isOpen: React.PropTypes.bool,
    onBodyClick: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleClickBody = this.handleClickBody.bind(this);
  }

  shouldComponentUpdate = shouldComponentUpdatePure;

  componentDidUpdate(prevProps, prevState) {
    if(!prevProps.isOpen && this.props.isOpen) {
      this.targetEl = ReactDOM.findDOMNode(this.refs.Popover);
      window.addEventListener('mousedown', this.handleClickBody);
      window.addEventListener('touchstart', this.handleClickBody);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.props.isOpen && !nextProps.isOpen) {
      window.removeEventListener('mousedown', this.handleClickBody);
      window.removeEventListener('touchstart', this.handleClickBody);
    }
  }

  handleClickBody(e) {
    if(!this.targetEl.contains(e.target)) {
      if(e.target.classList.length && e.target.classList[0].indexOf(css(styles.Popover)) !== -1) {
        this.props.onBodyClick();
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      this.props.onBodyClick();
    }
  }

  render() {
    let bodyClasses = css(styles.body);
    if(!this.props.isOpen) {
      bodyClasses += ` ${css(styles.isClosed)}`;
    }
    return (
      <div className={css(styles.Popover)} ref="Popover">
        {this.props.children}
        <div className={bodyClasses}>
          {this.props.body}
        </div>
      </div>
    );
  }
}

export default Popover
