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
    let paymentMethodDetails = paymentMethod.details;
    let iconStyle = css(styles.creditCardIconDefault);
    let lastFour = null;
    let expiration = null;
    if(paymentMethod.type === 'apple_pay') {
      iconStyle = css(styles.creditCardIconApplePay);
    } else if(paymentMethod.type === 'android_pay') {
      iconStyle = css(styles.creditCardIconAndroidPay);
    } else {
      let cardType = paymentMethodDetails.type;
      let leadingBullets = includeLeadingBullets ? '•••• ' : null;
      switch(cardType) {
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
      lastFour = (
        <span className={css(styles.lastFour)}>{leadingBullets}{paymentMethodDetails.last_four}</span>
      );
    }
    if(includeExpiration && paymentMethodDetails.expiration_month && paymentMethodDetails.expiration_year) {
      expiration = <span className={css(styles.ccExpiration)}>Exp {paymentMethodDetails.expiration_month}/{paymentMethodDetails.expiration_year.slice(-2)}</span>;
    }
    return (
      <span className={this.props.className}>
        <span className={iconStyle} /> <span className={css(styles.ccLastFour)}>{lastFour}</span>{expiration}
      </span>
    );
  }
}

export default PaymentMethodSummary;
