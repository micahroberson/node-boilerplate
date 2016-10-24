import React from 'react';
import {css} from 'aphrodite/no-important';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import PaymentMethod from '../../models/PaymentMethod';
import styles from './styles';

class PaymentMethodSummary extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func
  };

  static propTypes = {
    className: React.PropTypes.string,
    paymentMethod: React.PropTypes.instanceOf(PaymentMethod).isRequired,
    includeExpiration: React.PropTypes.bool,
    includeLeadingBullets: React.PropTypes.bool
  };

  static defaultProps = {
    includeExpiration: false,
    includeLeadingBullets: false
  };

  shouldComponentUpdate = shouldComponentUpdatePure;

  render() {
    let {paymentMethod, includeLeadingBullets, includeExpiration} = this.props;
    let iconStyle = css(styles.creditCardIconDefault);
    let expiration = null;
    let leadingBullets = includeLeadingBullets ? '•••• ' : null;
    switch(paymentMethod.brand) {
      case 'Visa':
        iconStyle = css(styles.creditCardIconVisa);
        break;
      case 'American Express':
        iconStyle = css(styles.creditCardIconAmericanExpress);
        break;
      case 'MasterCard':
        iconStyle = css(styles.creditCardIconMasterCard);
        break;
      case 'Discover':
        iconStyle = css(styles.creditCardIconDiscover);
        break;
    }
    let lastFour = (
      <span className={css(styles.lastFour)}>{leadingBullets}{paymentMethod.last_four}</span>
    );
    if(includeExpiration && paymentMethod.expiration_month && paymentMethod.expiration_year) {
      expiration = <span className={css(styles.ccExpiration)}>Exp {paymentMethod.expiration_month}/{paymentMethod.expiration_year.slice(-2)}</span>;
    }
    return (
      <span className={this.props.className}>
        <span className={iconStyle} /> <span className={css(styles.ccLastFour)}>{lastFour}</span>{expiration}
      </span>
    );
  }
}

export default PaymentMethodSummary;
