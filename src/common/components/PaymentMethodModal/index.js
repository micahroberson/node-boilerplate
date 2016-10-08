import React from 'react';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import Modal from '../Modal';
import PaymentMethod from '../PaymentMethod';
import {StripePublishableKey} from '../../client/config';

export const Modes = {
  Add: 'add',
  Select: 'select'
};

class PaymentMethodModal extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func,
    getUserAgent: React.PropTypes.func,
    trackEvent: React.PropTypes.func
  };

  static propTypes = {
    selectedPaymentMethodId   : React.PropTypes.string,
    paymentMethods            : React.PropTypes.object,
    customer                  : React.PropTypes.instanceOf(Customer),
    storeId                   : React.PropTypes.string,
    mode                      : React.PropTypes.string,
    onCancel                  : React.PropTypes.func.isRequired,
    onSave                    : React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  shouldComponentUpdate = shouldComponentUpdatePure;

  getStateFromProps(props) {
    return {
      error                   : null,
      loading                 : false,
      mode                    : props.mode ? props.mode : props.paymentMethods.size ? Modes.Select : Modes.Add,
      selectedPaymentMethodId : props.selectedPaymentMethodId,
      newPaymentMethod        : fromJS({
        number    : {value: '', state: 'empty'},
        exp_month : {value: '', state: 'empty'},
        exp_year  : {value: '', state: 'empty'},
        cvc       : {value: '', state: 'empty'}
      })
    };
  }

  trackViewEvent() {
    let value = this.state.mode === Modes.Select ? 'payment_method_select' : 'payment_method_enter';
    if(this.props.storeId) {
      value = `checkout_${value}`;
    }
    this.context.trackEvent('view', {value});
  }

  componentDidMount() {
    Stripe.setPublishableKey(StripePublishableKey);
    this.trackViewEvent();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
    // Auto-select most recently added
    // if(nextProps.paymentMethods.size > this.props.paymentMethods.size) {
    //   this.setState({selectedPaymentMethodId: nextProps.paymentMethods.get(0).id});
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.mode !== this.state.mode) {
      this.trackViewEvent();
    }
  }

  handleOnChangePaymentMethod(id) {
    if(id === this.state.selectedPaymentMethodId) {return;}
    this.setState({selectedPaymentMethodId: id});
    this.props.onSave({paymentMethodId: id});
  }

  handleOnChangeNewPaymentMethodInput(field, e) {
    let value = e.target.value.replace(/\D/g, '');
    let state;
    let updates = {};
    switch(field) {
      case 'number':
        if(!value.length) {
          state = 'empty';
        } else {
          value = this.isMobile ? value.slice(0, 16) : formatCreditCardNumber(value);
          state = value.length < 14 ? 'valid' : (Stripe.card.validateCardNumber(value) ? 'valid' : 'invalid');
        }
        break;
      case 'exp_month':
        if(!value.length) {
          state = 'empty';
        } else {
          value = value.slice(0, 2);
          state = 'valid';// (value.length === 2) ? 'valid' : 'invalid';
          if(parseInt(value) > 12) {state = 'invalid';}
        }
       break;
      case 'exp_year':
        if(!value.length) {
          state = 'empty';
        } else {
          value = value.slice(0, 2);
          state = (value.length === 2 && parseInt(value) < 16) ? 'invalid' : 'valid';
        }
        break;
      case 'cvc':
        if(!value.length) {
          state = 'empty';
        } else {
          value = value.slice(0, 4);
          state = value.length < 3 ? 'valid' : (Stripe.card.validateCVC(value) ? 'valid' : 'invalid');
        }
        break;
    }
    updates[field] = {value, state};
    this.setState({
      newPaymentMethod: this.state.newPaymentMethod.merge(updates)
    });
  }

  handleOnKeyDownNewPaymentMethodInput(field, e) {
    if(e.which === 13 && this.validateNewPaymentMethod()) {
      this.handleOnClickContinueButton();
    }
  }

  handleOnClickAddNewPaymentMethodButton(e) {
    this.setState({mode : Modes.Add});
  }

  handleOnClickContinueButton(e) {
    if(this.state.mode === Modes.Add) {
      this.setState({loading : true});
      createStripeToken(this.state.newPaymentMethod, (error, updatedPaymentMethod, stripeTokenObject) => {
        if(error) {
          this.setState({
            loading          : false,
            error            : error,
            newPaymentMethod : updatedPaymentMethod
          });
        }
        if(this.props.customer.isSignedIn()) {
          this.context.executeAction(CustomerActions.addPaymentMethod, {
            payment_method: {
              stripe_token_id: stripeTokenObject.id
            },
            store_id: this.props.storeId // Optional for setting on shoppingcart
          });
          this.props.onSave();
        } else {
          this.props.onSave({
            stripeTokenId: stripeTokenObject.id,
            stripeTokenObject: stripeTokenObject
          });
        }
      });
    }
  }

  handleOnClickRemoveButton(id ,e) {
    e.stopPropagation();
    e.preventDefault();

    if(this.props.customer.isSignedIn()) {
      this.context.executeAction(CustomerActions.removePaymentMethod, {
        payment_method_id: id
      });
    }
  }

  handleOnCloseModal() {
    this.props.onCancel();
  }

  validateNewPaymentMethod() {
    let newPaymentMethod = this.state.newPaymentMethod;
    return !(
      newPaymentMethod.getIn(['number', 'state']) !== 'valid'
      ||
      newPaymentMethod.getIn(['exp_month', 'state']) !== 'valid'
      ||
      newPaymentMethod.getIn(['exp_year', 'state']) !== 'valid'
      ||
      newPaymentMethod.getIn(['cvc', 'state']) !== 'valid'
    );
  }

  renderContinueButton() {
    if(this.state.mode !== Modes.Add) {return null;}
    let disabled = !this.validateNewPaymentMethod();
    let continueButtonProps = {
      className : styles.continueButton,
      disabled  : disabled,
      onClick   : this.handleOnClickContinueButton.bind(this)
    };
    let buttonText = this.state.loading ? <span className="loading-spinner--white" /> : 'Submit';
    return <button {...continueButtonProps}>{buttonText}</button>;
  }

  renderError() {
    if(!this.state.error) {return null;}
    return <span className={styles.error}>{this.state.error}</span>;
  }

  renderPaymentMethods(paymentMethods) {
    if(this.state.mode === Modes.Add) {return null;}
    let selectedPaymentMethodId = this.state.selectedPaymentMethodId;
    return paymentMethods.map(paymentMethod => {
      let id = paymentMethod.id;
      let paymentMethodButtonProps = {
        key           : id,
        className     : styles.paymentMethodButton,
        onClick       : this.handleOnChangePaymentMethod.bind(this, id)
      };
      let paymentMethodProps = {
        className     : styles.paymentMethod,
        includeLeadingBullets: true,
        paymentMethod : paymentMethod
      };
      let inputProps = {
        className     : styles.checkbox,
        type          : 'checkbox',
        name          : id,
        id            : id,
        checked       : selectedPaymentMethodId === id,
        onChange      : this.handleOnChangePaymentMethod.bind(this, id)
      };
      let labelProps = {
        className     : styles.checkboxLabel,
        htmlFor       : id
      };
      let removeButtonProps = {
        className: styles.removeButton,
        onClick: this.handleOnClickRemoveButton.bind(this, id)
      };
      return (
        <div {...paymentMethodButtonProps}>
          <input {...inputProps} />
          <label {...labelProps}>
            <PaymentMethod {...paymentMethodProps} />
          </label>
          <button {...removeButtonProps}>Remove</button>
        </div>
      );
    });
  }

  renderAddNewPaymentMethodButton() {
    if(this.state.mode !== Modes.Select) {return null;}
    let paymentMethodButtonProps = {
      className     : styles.newPaymentMethodButton,
      onClick       : this.handleOnClickAddNewPaymentMethodButton.bind(this)
    };
    return (
      <button {...paymentMethodButtonProps}>Add new card</button>
    );
  }

  renderForm() {
    if(this.state.mode !== Modes.Add) {return null;}
    let isMobile = isMobileOrTablet();
    let newPaymentMethod = this.state.newPaymentMethod;
    let ccNumberInputProps = {
      type        : isMobile ? 'tel' : 'text',
      autoFocus   : true,
      autoComplete: 'cc-number',
      className   : styles.ccNumberInput + (newPaymentMethod.get('number').get('state') === 'invalid' ? (' ' + styles.ccInputInvalid) : ''),
      placeholder : 'Card number',
      value       : newPaymentMethod.get('number').get('value'),
      onChange    : this.handleOnChangeNewPaymentMethodInput.bind(this, 'number'),
      onKeyDown   : this.handleOnKeyDownNewPaymentMethodInput.bind(this, 'number')
    };
    let ccExpMonthInputProps = {
      type        : isMobile ? 'tel' : 'text',
      autoComplete: 'cc-exp-month',
      className   : styles.ccExpMonthInput + (newPaymentMethod.get('exp_month').get('state') === 'invalid' ? (' ' + styles.ccInputInvalid) : ''),
      placeholder : 'MM',
      value       : newPaymentMethod.get('exp_month').get('value'),
      onChange    : this.handleOnChangeNewPaymentMethodInput.bind(this, 'exp_month'),
      onKeyDown   : this.handleOnKeyDownNewPaymentMethodInput.bind(this, 'exp_month')
    };
    let ccExpYearInputProps = {
      type        : isMobile ? 'tel' : 'text',
      autoComplete: 'cc-exp-year',
      className   : styles.ccExpYearInput + (newPaymentMethod.get('exp_year').get('state') === 'invalid' ? (' ' + styles.ccInputInvalid) : ''),
      placeholder : 'YY',
      value       : newPaymentMethod.get('exp_year').get('value'),
      onChange    : this.handleOnChangeNewPaymentMethodInput.bind(this, 'exp_year'),
      onKeyDown   : this.handleOnKeyDownNewPaymentMethodInput.bind(this, 'exp_year')
    };
    let ccCvcInputProps = {
      type        : isMobile ? 'tel' : 'text',
      autoComplete: 'cc-csc',
      className   : styles.ccCvcInput + (newPaymentMethod.get('cvc').get('state') === 'invalid' ? (' ' + styles.ccInputInvalid) : ''),
      placeholder : 'CVC',
      value       : newPaymentMethod.get('cvc').get('value'),
      onChange    : this.handleOnChangeNewPaymentMethodInput.bind(this, 'cvc'),
      onKeyDown   : this.handleOnKeyDownNewPaymentMethodInput.bind(this, 'cvc')
    };
    let cardIcon;
    // if(ccNumberInputProps.value.length) {
    //   cardIcon = <span className={cardIconClassFromNumber(ccNumberInputProps.value)} />;
    // }
    return (
      <div className={styles.form}>
        {this.renderError()}
        <div className={styles.inputContainer}>
          {cardIcon}
          <input {...ccNumberInputProps} />
          <input {...ccExpMonthInputProps} />
          <input {...ccExpYearInputProps} />
          <input {...ccCvcInputProps} />
        </div>
        <div className={styles.footer}>
          <span className={styles.securityMessage}>Secure 256-bit encryption</span>
          <span className={styles.ccAmericanExpress} />
          <span className={styles.ccMasterCard} />
          <span className={styles.ccDiscover} />
          <span className={styles.ccVisa} />
        </div>
      </div>
    );
  }

  render() {
    this.isMobile = this.isMobile || this.context.getUserAgent().isMobile;
    let modalProps = {
      onClose: this.handleOnCloseModal.bind(this),
      closeOnOutsideClick: true,
      className: styles.paymentMethodModal
    };
    let header = this.state.mode === Modes.Add ? 'Add card' : 'Payment method';
    return (
      <Modal {...modalProps}>
        <div className={styles.paymentMethodModalContents}>
          <button className={styles.closeButton} onClick={this.handleOnCloseModal.bind(this)}>
            <img src={menuClosePng} srcSet={menuCloseSvg} />
          </button>
          <h2 className={styles.header}>{header}</h2>
          <div>
            <div>
              {this.renderPaymentMethods(this.props.paymentMethods)}
            </div>
            {this.renderAddNewPaymentMethodButton()}
            {this.renderForm()}
          </div>
          {this.renderContinueButton()}
        </div>
      </Modal>
    );
  }
}

export default PaymentMethodModal;

function cardIconClassFromNumber(num) {
  for (var i = 0; i < cards.length; i++) {
    var n = cards[i];
    if (n.pattern.test(num)){
      return n.iconClass;
    }
  }
  return styles.ccDefault;
}

function cardTypeByNumber(num) {
  for (var i = 0; i < cards.length; i++) {
    var n = cards[i];
    if (n.pattern.test(num)){
      return n.type;
    }
  }
  return null;
}

function formatCreditCardNumber(num) {
  let groupPattern = /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/;
  for(var i = 0; i < cards.length; i++) {
    var n = cards[i];
    if(n.pattern.test(num) && n.groupPattern){
      groupPattern = n.groupPattern;
    }
  }

  return (num.match(groupPattern) || [])
    .slice(1)
    .filter(Boolean)
    .join(' ');
}

const cards = [
  {
    iconClass: styles.ccDefault,
    pattern: /^3(0|[68])/,
    groupPattern: /(\d{1,4})?(\d{1,6})?(\d{1,4})?/,
    length: 14,
    type: 'Diners Club'
  },
  {
    iconClass: styles.ccDefault,
    pattern: /^35/,
    length: 16,
    type: 'JCB'
  },
  {
    iconClass: styles.ccDiscover,
    pattern: /^6(011(0[0-9]|[2-4]|74|7[7-9]|8[6-9]|9[0-9])|4[4-9]|5)/,
    length: 16,
    type: 'Discover'
  },
  {
    iconClass: styles.ccMasterCard,
    pattern: /^5[1-5]/,
    length: 16,
    type: 'MasterCard'
  },
  {
    iconClass: styles.ccAmericanExpress,
    pattern: /^3[47]\d{13}$/,
    groupPattern: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    length: 15,
    type: 'American Express'
  },
  {
    iconClass: styles.ccVisa,
    pattern: /^4\d{12}(\d{3}|\d{6})?$/,
    groupPattern: /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?(\d{1,3})?/,
    length: 16,
    type: 'Visa'
  }
];

function createStripeToken(newPaymentMethod, cb) {
  Stripe.card.createToken({
    number    : newPaymentMethod.get('number').get('value'),
    exp_month : newPaymentMethod.get('exp_month').get('value'),
    exp_year  : newPaymentMethod.get('exp_year').get('value'),
    cvc       : newPaymentMethod.get('cvc').get('value')
  }, (status, response) => {
    if(response.error) {
      let param = response.error.param;
      return cb(response.error.message, newPaymentMethod.setIn([param, 'state'], 'invalid'), null);
    }
    return cb(null, newPaymentMethod, response);
  });
}