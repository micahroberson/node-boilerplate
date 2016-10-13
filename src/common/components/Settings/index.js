import React from 'react';
import {css} from 'aphrodite/no-important';
import User from '../../models/User';
import userActions from '../../actions/userActions';
import PaymentMethodModal from '../PaymentMethodModal';
import PaymentMethodSummary from '../PaymentMethodSummary';
import styles from './styles';

class Settings extends React.Component {
  static propTypes = {
    currentUser: React.PropTypes.instanceOf(User)
  };

  static contextTypes = {
    executeAction: React.PropTypes.func,
    getUserAgent: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      isPaymentMethodModalVisible: false,
      ...this.getStateFromProps(props)
    };
  }

  getStateFromProps(props) {
    let teamState = {};
    if(props.currentTeam) {
      teamState = {
        primaryPaymentMethodId: props.currentTeam.primary_payment_method_id,
        paymentMethods: props.currentTeam.payment_methods
      };
    }
    return {
      ...teamState,
      email: props.currentUser.email,
      name: props.currentUser.name
    };
  }

  handleOnChangeEmail(e) {
    this.setState({email: e.target.value});
  }

  handleOnChangeName(e) {
    this.setState({name: e.target.value});
  }

  handleOnClickEditButton(e) {
    this.setState({isEditing: true});
  }

  handleOnClickCancelButton(e) {
    this.setState({isEditing: false});
  }

  handleOnClickSaveButton(e) {
    let payload = {};
    let {currentUser} = this.props;
    if(this.state.email !== currentUser.email) {
      payload.email = this.state.email;
    }
    if(this.state.name !== currentUser.name) {
      payload.name = this.state.name;
    }
    this.setState({isEditing: false});
    this.context.executeAction(userActions.update, {
      ...payload,
      id: this.props.currentUser.id
    });
  }

  handleOnClickAddNewPaymentMethodButton(e) {
    this.setState({isPaymentMethodModalVisible: true});
  }

  handleOnChangePrimaryPaymentMethod(id, e) {
    this.setState({primaryPaymentMethodId: id});
  }

  handleOnCancelPaymentMethodModal() {
    this.setState({isPaymentMethodModalVisible: false});
  }

  handleOnAddPaymentMethodModal(payload) {
    this.setState({
      isPaymentMethodModalVisible: false,
      loading: true
    });
    this.context.executeAction(teamActions.addPaymentMethod, {
      stripe_token_id: payload.stripeTokenId
    });
  }

  handleOnClickRemovePaymentMethodButton(paymentMethodId) {
    this.setState({
      isPaymentMethodModalVisible: false,
      loading: true
    });
    this.context.executeAction(teamActions.removePaymentMethod, {
      payment_method_id: paymentMethodId
    });
  }

  renderPaymentMethods() {
    let {primaryPaymentMethodId, paymentMethods} = this.state;
    if(!paymentMethods) {return;}
    return paymentMethods.map((paymentMethod) => {
      let checkboxProps = {
        className: css(styles.checkbox),
        type: 'checkbox',
        checked: paymentMethod.id === primaryPaymentMethodId,
        onChange: this.handleOnChangePrimaryPaymentMethod.bind(this, paymentMethod.id)
      };
      let paymentMethodSummaryProps = {
        paymentMethod: paymentMethod,
        includeLeadingBullets: true
      };
      let removePaymentMethodButtonProps = {
        onClick: this.handleOnClickRemovePaymentMethodButton.bind(this, paymentMethod.id)
      };
      return (
        <div className={styles.paymentMethod} key={paymentMethod.id}>
          <input {...checkboxProps} />
          <PaymentMethodSummary {...paymentMethodSummaryProps} />
          <button {...removePaymentMethodButtonProps}>Remove</button>
        </div>
      );
    })
  }

  renderPaymentMethodModal() {
    if(!this.state.isPaymentMethodModalVisible) {return;}
    let {primaryPaymentMethodId, paymentMethods} = this.state;
    let paymentMethodModalProps = {
      paymentMethods,
      selectedPaymentMethodId: primaryPaymentMethodId,
      onCancel: this.handleOnCancelPaymentMethodModal.bind(this),
      onAdd: this.handleOnAddPaymentMethodModal.bind(this)
    };
    return <PaymentMethodModal {...paymentMethodModalProps} />;
  }

  render() {
    console.log("CONTEXT: ", this.context);
    let {email, name, isEditing} = this.state;
    let emailInputProps = {
      className: css(styles.input),
      id: 'email',
      type: 'email',
      value: email,
      disabled: !isEditing,
      onChange: this.handleOnChangeEmail.bind(this)
    };
    let nameInputProps = {
      className: css(styles.input),
      id: 'name',
      type: 'text',
      value: name,
      disabled: !isEditing,
      onChange: this.handleOnChangeName.bind(this)
    };
    let editButton = <button className={css(styles.editButton)} onClick={this.handleOnClickEditButton.bind(this)}>Edit</button>;
    let cancelButton = <button className={css(styles.cancelButton)} onClick={this.handleOnClickCancelButton.bind(this)}>Cancel</button>;
    let saveButton = <button className={css(styles.saveButton)} onClick={this.handleOnClickSaveButton.bind(this)}>Save</button>;
    let addNewPaymentMethodButtonProps = {
      className: css(styles.addNewPaymentMethodButton),
      onClick: this.handleOnClickAddNewPaymentMethodButton.bind(this)
    };
    return (
      <div className={css(styles.Settings)}>
        <div className={css(styles.header)}>
          <h1 className={css(styles.h1)}>Settings</h1>
          <div className={css(styles.actions)}>
            {!isEditing ? editButton : null}
            {isEditing ? cancelButton : null}
            {isEditing ? saveButton : null}
          </div>
        </div>
        <fieldset>
          <label htmlFor="name">Your full name</label>
          <input {...nameInputProps} />
        </fieldset>
        <fieldset>
          <label htmlFor="email">Your email address</label>
          <input {...emailInputProps} />
        </fieldset>
        <h2 className={css(styles.h2)}>Team Settings</h2>
        <fieldset>
          <label>Payment</label>
          {this.renderPaymentMethods()}
          <button {...addNewPaymentMethodButtonProps}>Add new payment method</button>
        </fieldset>
        {this.renderPaymentMethodModal()}
      </div>
    );
  }
}

export default Settings;
