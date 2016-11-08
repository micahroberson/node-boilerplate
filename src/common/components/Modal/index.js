import React from 'react';
import {findDOMNode} from 'react-dom';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import Portal from 'react-portal';
import {css} from 'aphrodite/no-important';
import styles from './styles';

class Modal extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    overlayClassName: React.PropTypes.string,
    style: React.PropTypes.object,
    closeOnOutsideClick: React.PropTypes.bool,
    onClose: React.PropTypes.func.isRequired
  };

  static defaultProps = {
    closeOnOutsideClick: true,
    style: {}
  };

  shouldComponentUpdate = shouldComponentUpdatePure;

  handleOnClickOverlay(e) {
    if(!this.props.closeOnOutsideClick || isNodeInRoot(e.target, findDOMNode(this.refs.modal))) {
      return;
    }
    e.stopPropagation();
    this.props.onClose();
  }

  render() {
    let classes = css(styles.modal);
    let overlayClasses = css(styles.modalOverlay);
    if(this.props.className) {
      classes += (' ' + this.props.className);
    }
    if(this.props.overlayClassName) {
      overlayClasses += (' ' + this.props.overlayClassName);
    }
    let portalProps = {
      isOpened: true,
      closeOnEsc: false,
      closeOnOutsideClick: this.props.closeOnOutsideClick,
      onClose: this.props.onClose
    };
    let overlayProps = {
      className: overlayClasses,
      onClick: this.handleOnClickOverlay.bind(this),
      ref: 'overlay'
    };
    let modalProps = {
      className: classes,
      style: this.props.style,
      ref: 'modal'
    };

    return (
      <Portal {...portalProps}>
        <div>
          <div {...overlayProps}>
            <div {...modalProps}>
              {this.props.children}
            </div>
          </div>
        </div>
      </Portal>
    );
  }
}

export default Modal;

function isNodeInRoot(node, root) {
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
