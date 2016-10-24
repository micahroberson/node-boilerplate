import _ from 'lodash';
import React from 'react';
import {css} from 'aphrodite/no-important';
import connectToStores from 'fluxible-addons-react/connectToStores';
import Team from '../../models/Team';
import User from '../../models/User';
import {RequestStates} from '../../stores/BaseStore';
import TeamsStore from '../../stores/TeamsStore';
import UsersStore from '../../stores/UsersStore';
import teamActions from '../../actions/teamActions';
import userActions from '../../actions/userActions';
import PaymentMethodModal from '../PaymentMethodModal';
import PaymentMethodSummary from '../PaymentMethodSummary';
import styles from './styles';

class Settings extends React.Component {
  static propTypes = {
    currentTeam: React.PropTypes.instanceOf(Team),
    currentUser: React.PropTypes.instanceOf(User)
  };

  static contextTypes = {
    executeAction: React.PropTypes.func,
    getUserAgent: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      isEditingTeamSettings: false,
      isEditingUserSettings: false,
      isPaymentMethodModalVisible: false,
      paymentMethodModalKey: 0, // Generate new on click 'Add' to force new component lifecycle
      ...this.getStateFromProps(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    let {updateTeamRequestState, addPaymentMethodTeamRequestState, updateUserRequestState} = this.props;
    if(updateTeamRequestState !== nextProps.updateTeamRequestState
      && updateTeamRequestState === RequestStates.Started
      && nextProps.updateTeamRequestState === RequestStates.Success) {
      this.setState({isEditingTeamSettings: false});
    }
    if(updateUserRequestState !== nextProps.updateUserRequestState
      && updateUserRequestState === RequestStates.Started
      && nextProps.updateUserRequestState === RequestStates.Success) {
      this.setState({isEditingUserSettings: false});
    }
    if(addPaymentMethodTeamRequestState !== nextProps.addPaymentMethodTeamRequestState
      && addPaymentMethodTeamRequestState === RequestStates.Started
      && nextProps.addPaymentMethodTeamRequestState === RequestStates.Success) {
      this.setState({isPaymentMethodModalVisible: false});
    }
    if(this.props.currentTeam !== nextProps.currentTeam || this.props.currentUser !== nextProps.currentUser) {
      this.setState(this.getStateFromProps(nextProps));
    }
  }

  getStateFromProps(props) {
    let teamState = {
      primaryPaymentMethodId: props.currentTeam ? props.currentTeam.primary_payment_method_id : null,
      paymentMethods: props.currentTeam ? props.currentTeam.payment_methods : []
    };
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

  handleOnClickEditButton(type, e) {
    this.setState({[type === 'user' ? 'isEditingUserSettings' : 'isEditingTeamSettings']: true});
  }

  handleOnClickCancelButton(type, e) {
    this.setState({
      ...this.getStateFromProps(this.props),
      [type === 'user' ? 'isEditingUserSettings' : 'isEditingTeamSettings']: false,
    });
  }

  handleOnClickSaveButton(type, e) {
    let {currentUser, currentTeam} = this.props;
    let payload = {};
    let action;
    if(type === 'user') {
      action = userActions.update;
      if(this.state.email !== currentUser.email) {
        payload.email = this.state.email;
      }
      if(this.state.name !== currentUser.name) {
        payload.name = this.state.name;
      }
    } else if(type === 'team') {
      action = teamActions.update;
      if(this.state.primaryPaymentMethodId !== currentTeam.primary_payment_method_id) {
        payload.primary_payment_method_id = this.state.primaryPaymentMethodId;
      }
    }
    if(!_.size(payload)) {return;}
    this.context.executeAction(action, payload);
  }

  handleOnClickAddNewPaymentMethodButton(e) {
    this.setState({
      isPaymentMethodModalVisible: true,
      paymentMethodModalKey: this.state.paymentMethodModalKey + 1,
    });
  }

  handleOnChangePrimaryPaymentMethod(id, e) {
    this.setState({primaryPaymentMethodId: id});
  }

  handleOnCancelPaymentMethodModal() {
    this.setState({isPaymentMethodModalVisible: false});
  }

  handleOnAddPaymentMethodModal(payload) {
    this.context.executeAction(teamActions.addPaymentMethod, {
      stripe_token_id: payload.stripeTokenId,
    });
  }

  handleOnClickRemovePaymentMethodButton(paymentMethodId) {
    this.setState({isPaymentMethodModalVisible: false});
    this.context.executeAction(teamActions.removePaymentMethod, {
      payment_method_id: paymentMethodId,
    });
  }

  renderPaymentMethods() {
    let {primaryPaymentMethodId, paymentMethods, isEditingTeamSettings} = this.state;
    if(!paymentMethods) {return;}
    return paymentMethods.map((paymentMethod) => {
      let checkboxLabelProps = {
        className: `${css(styles.checkboxLabel)} ${isEditingTeamSettings ? null : css(styles.disabledCheckboxLabel)}`,
        htmlFor: paymentMethod.id,
      };
      let checkboxInputProps = {
        className: css(styles.checkboxInput),
        id: paymentMethod.id,
        type: 'checkbox',
        checked: paymentMethod.id === primaryPaymentMethodId,
        disabled: !isEditingTeamSettings,
        onChange: this.handleOnChangePrimaryPaymentMethod.bind(this, paymentMethod.id),
      };
      let checkboxCheckmarkProps = {
        className: css(styles.checkboxCheckmark),
      };
      let paymentMethodSummaryProps = {
        paymentMethod: paymentMethod,
        includeLeadingBullets: true,
      };
      let removePaymentMethodButtonProps = {
        className: css(styles.removePaymentMethodButton),
        onClick: this.handleOnClickRemovePaymentMethodButton.bind(this, paymentMethod.id),
      };
      return (
        <div className={css(styles.paymentMethod)} key={paymentMethod.id}>
          <label {...checkboxLabelProps}>
            <input {...checkboxInputProps} />
            <div {...checkboxCheckmarkProps} />
          </label>
          <PaymentMethodSummary {...paymentMethodSummaryProps} />
          {isEditingTeamSettings ? <button {...removePaymentMethodButtonProps}>Remove</button> : null}
        </div>
      );
    })
  }

  renderPaymentMethodModal() {
    if(!this.state.isPaymentMethodModalVisible) {return;}
    let {primaryPaymentMethodId, paymentMethods, paymentMethodModalKey} = this.state;
    let paymentMethodModalProps = {
      paymentMethods,
      key: paymentMethodModalKey,
      mode: 'add',
      primaryPaymentMethodId: primaryPaymentMethodId,
      loading: this.props.addPaymentMethodTeamRequestState === RequestStates.Started,
      error: this.props.addPaymentMethodTeamRequestError,
      onCancel: this.handleOnCancelPaymentMethodModal.bind(this),
      onAdd: this.handleOnAddPaymentMethodModal.bind(this)
    };
    return <PaymentMethodModal {...paymentMethodModalProps} />;
  }

  renderActionButtons(isEditing, isLoading, clickHandlerArg) {
    let editButtonProps = {
      className: css(styles.editButton),
      onClick: this.handleOnClickEditButton.bind(this, clickHandlerArg),
    };
    let editButton = <button {...editButtonProps}>Edit</button>;
    if(!isEditing) {
      return editButton;
    }
    let cancelButtonProps = {
      key: 'cancel',
      className: css(styles.cancelButton),
      onClick: this.handleOnClickCancelButton.bind(this, clickHandlerArg),
    };
    let cancelButton = <button {...cancelButtonProps}>Cancel</button>;
    let saveButtonProps = {
      key: 'save',
      className: css(styles.saveButton),
      onClick: this.handleOnClickSaveButton.bind(this, clickHandlerArg),
    };
    let saveButtonContents = isLoading ? <span className="loadingSpinner loadingSpinnerGreen" /> : 'Save';
    let saveButton = <button {...saveButtonProps}>{saveButtonContents}</button>;
    return [cancelButton, saveButton];
  }

  renderError(error) {
    if(!error) {return;}
    return <div className={css(styles.error)}>{error.message}</div>;
  }

  render() {
    let {email, name, isEditingUserSettings, isEditingTeamSettings} = this.state;
    let {updateUserRequestState, updateUserRequestError, addPaymentMethodTeamRequestState, addPaymentMethodTeamRequestError, updateTeamRequestState, updateTeamRequestError} = this.props;
    let emailInputProps = {
      className: css(styles.input),
      id: 'email',
      type: 'email',
      value: email,
      disabled: !isEditingUserSettings,
      onChange: this.handleOnChangeEmail.bind(this)
    };
    let nameInputProps = {
      className: css(styles.input),
      id: 'name',
      type: 'text',
      value: name,
      disabled: !isEditingUserSettings,
      onChange: this.handleOnChangeName.bind(this)
    };
    let addNewPaymentMethodButtonProps = {
      className: css(styles.addNewPaymentMethodButton),
      onClick: this.handleOnClickAddNewPaymentMethodButton.bind(this)
    };
    return (
      <div className={css(styles.Settings)}>
        <div className={css(styles.header)}>
          <h2 className={css(styles.h2)}>Your settings</h2>
          <div className={css(styles.actions)}>
            {this.renderActionButtons(isEditingUserSettings, updateUserRequestState === RequestStates.Started, 'user')}
          </div>
        </div>
        {this.renderError(updateUserRequestError)}
        <fieldset>
          <label htmlFor="name">Your full name</label>
          <input {...nameInputProps} />
        </fieldset>
        <fieldset>
          <label htmlFor="email">Your email address</label>
          <input {...emailInputProps} />
        </fieldset>
        <div className={css(styles.header)}>
          <h2 className={css(styles.h2)}>Team settings</h2>
          <div className={css(styles.actions)}>
            {this.renderActionButtons(isEditingTeamSettings, updateTeamRequestState === RequestStates.Started, 'team')}
          </div>
        </div>
        {this.renderError(updateTeamRequestError)}
        <fieldset>
          <label>Primary payment method</label>
          {this.renderPaymentMethods()}
          {isEditingTeamSettings ? <button {...addNewPaymentMethodButtonProps}>Add new</button> : null}
        </fieldset>
        {this.renderPaymentMethodModal()}
      </div>
    );
  }
}

export let undecorated = Settings;

Settings = connectToStores(Settings, [TeamsStore, UsersStore], (context, props) => {
  let teamsStore = context.getStore(TeamsStore);
  let usersStore = context.getStore(UsersStore);
  let {state: addPaymentMethodTeamRequestState, error: addPaymentMethodTeamRequestError} = teamsStore.getEventData('ADD_PAYMENT_METHOD');
  let {state: updateTeamRequestState, error: updateTeamRequestError} = teamsStore.getEventData('UPDATE');
  let {state: updateUserRequestState, error: updateUserRequestError} = usersStore.getEventData('UPDATE');
  return {
    addPaymentMethodTeamRequestState,
    addPaymentMethodTeamRequestError,
    updateTeamRequestState,
    updateTeamRequestError,
    updateUserRequestState,
    updateUserRequestError,
    currentTeam: teamsStore.getCurrentTeam(),
    currentUser: usersStore.getCurrentUser(),
  };
});

export default Settings;
