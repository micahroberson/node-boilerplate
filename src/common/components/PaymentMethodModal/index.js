import React from 'react';
import {css} from 'aphrodite/no-important';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import Modal from '../Modal';
import PaymentMethodSummary from '../PaymentMethodSummary';
import config from '../../../client/config';
import menuClosePng from '../../images/button_menu_close.png';
import menuCloseSvg from '../../images/button_menu_close.svg';
import styles from './styles';

export const Modes = {
  Add: 'add',
  Select: 'select'
};
const FormStates = {
  Empty: 'empty',
  Valid: 'valid',
  Invalid: 'invalid'
};

class PaymentMethodModal extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func,
    getUserAgent: React.PropTypes.func
  };

  static propTypes = {
    selectedPaymentMethodId: React.PropTypes.string,
    paymentMethods: React.PropTypes.array,
    mode: React.PropTypes.string,
    loading: React.PropTypes.bool,
    error: React.PropTypes.object,
    onCancel: React.PropTypes.func.isRequired,
    onAdd: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func,
    onSelect: React.PropTypes.func
  };

  static defaultProps = {
    loading: false,
    error: null
  };

  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  shouldComponentUpdate = shouldComponentUpdatePure;

  getStateFromProps(props) {
    let mode = props.mode;
    if(!mode) {
      mode = props.paymentMethods.length ? Modes.Select : Modes.Add;
    }
    return {
      mode,
      error: props.error,
      loading: props.loading,
      selectedPaymentMethodId: props.selectedPaymentMethodId,
      formValues: {
        number: '',
        exp_month: '',
        exp_year: '',
        cvc: ''
      },
      formStates: {
        number: FormStates.Empty,
        exp_month: FormStates.Empty,
        exp_year: FormStates.Empty,
        cvc: FormStates.Empty
      }
    };
  }

  componentDidMount() {
    Stripe.setPublishableKey(config.StripePublishableKey);
  }

  componentWillReceiveProps(nextProps) {
    let {loading, error} = this.props;
    if(loading !== nextProps.loading) {
      this.setState({loading: nextProps.loading});
    }
    if(error !== nextProps.error) {
      this.setState({error: nextProps.error});
    }
  }

  handleOnChangePaymentMethod(id) {
    if(id === this.state.selectedPaymentMethodId) {return;}
    this.setState({selectedPaymentMethodId: id});
    this.props.onSelect(id);
  }

  handleOnChangeFormInput(field, e) {
    let value = e.target.value.replace(/\D/g, '');
    let state;
    let updates = {};
    switch(field) {
      case 'number':
        if(!value.length) {
          state = 'empty';
        } else {
          value = this.isMobile ? value.slice(0, 16) : formatCreditCardNumber(value);
          state = value.length < 14 ? FormStates.Valid : (Stripe.card.validateCardNumber(value) ? FormStates.Valid : FormStates.Invalid);
        }
        break;
      case 'exp_month':
        if(!value.length) {
          state = 'empty';
        } else {
          value = value.slice(0, 2);
          state = FormStates.Valid;
          if(parseInt(value) > 12) {state = FormStates.Invalid;}
        }
       break;
      case 'exp_year':
        if(!value.length) {
          state = 'empty';
        } else {
          value = value.slice(0, 2);
          state = (value.length === 2 && parseInt(value) < 16) ? FormStates.Invalid : FormStates.Valid;
        }
        break;
      case 'cvc':
        if(!value.length) {
          state = 'empty';
        } else {
          value = value.slice(0, 4);
          state = value.length < 3 ? FormStates.Valid : (Stripe.card.validateCVC(value) ? FormStates.Valid : FormStates.Invalid);
        }
        break;
    }
    this.setState({
      formStates: {
        ...this.state.formStates,
        [field]: state,
      },
      formValues: {
        ...this.state.formValues,
        [field]: value,
      }
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
      createStripeToken(this.state.formValues, this.state.formStates, (error, updatedFormStates, stripeTokenObject) => {
        if(error) {
          return this.setState({
            loading: false,
            error: error,
            formStates: updatedFormStates
          });
        }
        this.props.onAdd({
          stripeTokenId: stripeTokenObject.id,
          stripeTokenObject: stripeTokenObject
        });
      });
    }
  }

  handleOnClickRemoveButton(id ,e) {
    e.stopPropagation();
    e.preventDefault();

    this.props.onRemove(id);
  }

  handleOnCloseModal() {
    this.props.onCancel();
  }

  validateNewPaymentMethod() {
    return -1 === Object.values(this.state.formStates).indexOf(FormStates.Invalid);
  }

  renderContinueButton() {
    if(this.state.mode !== Modes.Add) {return null;}
    let disabled = !this.validateNewPaymentMethod();
    let continueButtonProps = {
      className: css(styles.continueButton),
      disabled: disabled,
      onClick: this.handleOnClickContinueButton.bind(this)
    };
    let buttonText = this.state.loading ? <span className="loadingSpinner" /> : 'Submit';
    return <button {...continueButtonProps}>{buttonText}</button>;
  }

  renderError() {
    if(!this.state.error) {return null;}
    return <span className={css(styles.error)}>{this.state.error.message}</span>;
  }

  renderPaymentMethods(paymentMethods) {
    if(this.state.mode === Modes.Add) {return null;}
    let selectedPaymentMethodId = this.state.selectedPaymentMethodId;
    return paymentMethods.map(paymentMethod => {
      let id = paymentMethod.id;
      let paymentMethodButtonProps = {
        key: id,
        className: css(styles.paymentMethodButton),
        onClick: this.handleOnChangePaymentMethod.bind(this, id)
      };
      let paymentMethodSummaryProps = {
        paymentMethod,
        // className: css(styles.paymentMethod),
        includeLeadingBullets: true,
      };
      let inputProps = {
        id,
        className: css(styles.checkbox),
        type: 'checkbox',
        name: id,
        checked: selectedPaymentMethodId === id,
        onChange: this.handleOnChangePaymentMethod.bind(this, id)
      };
      let labelProps = {
        className: css(styles.checkboxLabel),
        htmlFor: id
      };
      let removeButtonProps = {
        className: css(styles.removeButton),
        onClick: this.handleOnClickRemoveButton.bind(this, id)
      };
      return (
        <div {...paymentMethodButtonProps}>
          <input {...inputProps} />
          <label {...labelProps}>
            <PaymentMethodSummary {...paymentMethodSummaryProps} />
          </label>
          <button {...removeButtonProps}>Remove</button>
        </div>
      );
    });
  }

  renderAddNewPaymentMethodButton() {
    if(this.state.mode !== Modes.Select) {return null;}
    let paymentMethodButtonProps = {
      className: css(styles.newPaymentMethodButton),
      onClick: this.handleOnClickAddNewPaymentMethodButton.bind(this)
    };
    return (
      <button {...paymentMethodButtonProps}>Add new card</button>
    );
  }

  renderForm() {
    let {mode, formStates, formValues} = this.state;
    if(mode !== Modes.Add) {return null;}
    let newPaymentMethod = this.state.newPaymentMethod;
    let ccNumberInputProps = {
      type: this.isMobile ? 'tel' : 'text',
      autoFocus: true,
      autoComplete: 'cc-number',
      className: `${css(styles.ccNumberInput)} ${formStates.number === FormStates.Invalid ? css(styles.ccInputInvalid) : ''}`,
      placeholder: 'Card number',
      value: formValues.number,
      onChange: this.handleOnChangeFormInput.bind(this, 'number'),
      onKeyDown: this.handleOnKeyDownNewPaymentMethodInput.bind(this, 'number')
    };
    let ccExpMonthInputProps = {
      type: this.isMobile ? 'tel' : 'text',
      autoComplete: 'cc-exp-month',
      className: `${css(styles.ccExpMonthInput)} ${formStates.exp_month === FormStates.Invalid ? css(styles.ccInputInvalid) : ''}`,
      placeholder: 'MM',
      value: formValues.exp_month,
      onChange: this.handleOnChangeFormInput.bind(this, 'exp_month'),
      onKeyDown: this.handleOnKeyDownNewPaymentMethodInput.bind(this, 'exp_month')
    };
    let ccExpYearInputProps = {
      type: this.isMobile ? 'tel' : 'text',
      autoComplete: 'cc-exp-year',
      className: `${css(styles.ccExpYearInput)} ${formStates.exp_year === FormStates.Invalid ? css(styles.ccInputInvalid) : ''}`,
      placeholder: 'YY',
      value: formValues.exp_year,
      onChange: this.handleOnChangeFormInput.bind(this, 'exp_year'),
      onKeyDown: this.handleOnKeyDownNewPaymentMethodInput.bind(this, 'exp_year')
    };
    let ccCvcInputProps = {
      type: this.isMobile ? 'tel' : 'text',
      autoComplete: 'cc-csc',
      className: `${css(styles.ccCvcInput)} ${formStates.cvc === FormStates.Invalid ? css(styles.ccInputInvalid) : ''}`,
      placeholder: 'CVC',
      value: formValues.cvc,
      onChange: this.handleOnChangeFormInput.bind(this, 'cvc'),
      onKeyDown: this.handleOnKeyDownNewPaymentMethodInput.bind(this, 'cvc')
    };
    return (
      <div className={css(styles.form)}>
        {this.renderError()}
        <div className={css(styles.inputContainer)}>
          <input {...ccNumberInputProps} />
          <input {...ccExpMonthInputProps} />
          <input {...ccExpYearInputProps} />
          <input {...ccCvcInputProps} />
        </div>
        <div className={css(styles.footer)}>
          <span className={css(styles.securityMessage)}>Secure 256-bit encryption</span>
          <span className={css(styles.creditCardIconAmericanExpress)} />
          <span className={css(styles.creditCardIconMasterCard)} />
          <span className={css(styles.creditCardIconDiscover)} />
          <span className={css(styles.creditCardIconVisa)} />
        </div>
      </div>
    );
  }

  render() {
    this.isMobile = this.isMobile || this.context.getUserAgent().isMobile;
    let modalProps = {
      onClose: this.handleOnCloseModal.bind(this),
      closeOnOutsideClick: true,
      className: css(styles.paymentMethodModal)
    };
    let header = this.state.mode === Modes.Add ? 'Add card' : 'Payment method';
    return (
      <Modal {...modalProps}>
        <div className={css(styles.paymentMethodModalContents)}>
          <button className={css(styles.closeButton)} onClick={this.handleOnCloseModal.bind(this)}>
            <img src={menuClosePng} srcSet={menuCloseSvg} />
          </button>
          <h2 className={css(styles.header)}>{header}</h2>
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
    pattern: /^3(0|[68])/,
    groupPattern: /(\d{1,4})?(\d{1,6})?(\d{1,4})?/,
    length: 14,
    type: 'Diners Club'
  },
  {
    pattern: /^35/,
    length: 16,
    type: 'JCB'
  },
  {
    pattern: /^6(011(0[0-9]|[2-4]|74|7[7-9]|8[6-9]|9[0-9])|4[4-9]|5)/,
    length: 16,
    type: 'Discover'
  },
  {
    pattern: /^5[1-5]/,
    length: 16,
    type: 'MasterCard'
  },
  {
    pattern: /^3[47]\d{13}$/,
    groupPattern: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    length: 15,
    type: 'American Express'
  },
  {
    pattern: /^4\d{12}(\d{3}|\d{6})?$/,
    groupPattern: /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?(\d{1,3})?/,
    length: 16,
    type: 'Visa'
  }
];

function createStripeToken(values, states, cb) {
  Stripe.card.createToken(values, (status, response) => {
    if(response.error) {
      let field = response.error.param;
      return cb(response.error, {
        ...states,
        [field]: FormStates.Invalid,
      }, null);
    }
    return cb(null, states, response);
  });
}