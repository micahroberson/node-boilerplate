import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import {css} from 'aphrodite/no-important';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import {RequestStates} from '../../stores/BaseStore';
import SubscriptionPlansStore from '../../stores/SubscriptionPlansStore';
import SubscriptionsStore from '../../stores/SubscriptionsStore';
import subscriptionPlanActions from '../../actions/subscriptionPlanActions';
import subscriptionActions from '../../actions/subscriptionActions';
import Modal from '../Modal';
import menuClosePng from '../../images/button_menu_close.png';
import menuCloseSvg from '../../images/button_menu_close.svg';
import styles from './styles';

class SubscriptionPlanModal extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func,
    getUserAgent: React.PropTypes.func
  };

  static propTypes = {
    subscriptionId: React.PropTypes.string,
    selectedSubscriptionPlanId: React.PropTypes.string,
    subscriptionPlans: React.PropTypes.array,
    updateSubscriptionRequestState: React.PropTypes.string,
    updateSubscriptionRequestError: React.PropTypes.object,
    onClose: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedSubscriptionPlanId: props.selectedSubscriptionPlanId,
      loading: false,
    };
  }

  shouldComponentUpdate = shouldComponentUpdatePure;

  componentDidMount() {
    this.context.executeAction(subscriptionPlanActions.list, {});
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.selectedSubscriptionPlanId !== this.props.selectedSubscriptionPlanId) {
      this.setState({selectedSubscriptionPlanId: nextProps.selectedSubscriptionPlanId});
    }
    let {updateSubscriptionRequestState} = this.props;
    if(updateSubscriptionRequestState !== nextProps.updateSubscriptionRequestState
      && updateSubscriptionRequestState === RequestStates.Started
      && nextProps.updateSubscriptionRequestState === RequestStates.Success) {
      this.setState({loading: false});
      this.props.onClose();
    }
  }

  handleOnClickSaveButton(e) {
    if(this.state.selectedSubscriptionPlanId === this.props.selectedSubscriptionPlanId) {
      return;
    }
    this.setState({loading : true});
    this.context.executeAction(subscriptionActions.update, {
      id: this.props.subscriptionId,
      subscription_plan_id: this.state.selectedSubscriptionPlanId
    });
  }

  handleOnClickCancelButton(e) {
    this.handleOnCloseModal();
  }

  handleOnCloseModal() {
    this.props.onClose();
  }

  handleOnChangeSelectedSubscriptionPlan(id, e) {
    this.setState({selectedSubscriptionPlanId: id});
  }

  renderError() {
    if(!this.props.updateSubscriptionRequestError) {return null;}
    return <span className={css(styles.error)}>{this.props.updateSubscriptionRequestError.message}</span>;
  }

  renderSubscriptionPlans() {
    let {subscriptionPlans} = this.props;
    let {selectedSubscriptionPlanId} = this.state;
    return subscriptionPlans.map((subscriptionPlan) => {
      let checkboxLabelProps = {
        className: `${css(styles.checkboxLabel)}`,
        htmlFor: subscriptionPlan.id,
      };
      let checkboxInputProps = {
        className: css(styles.checkboxInput),
        id: subscriptionPlan.id,
        type: 'checkbox',
        checked: subscriptionPlan.id === selectedSubscriptionPlanId,
        onChange: this.handleOnChangeSelectedSubscriptionPlan.bind(this, subscriptionPlan.id),
      };
      let checkboxCheckmarkProps = {
        className: css(styles.checkboxCheckmark),
      };
      return (
        <div className={css(styles.subscriptionPlan)} key={subscriptionPlan.id}>
          <label {...checkboxLabelProps}>
            <input {...checkboxInputProps} />
            <div {...checkboxCheckmarkProps} />
          </label>
          <span className={css(styles.subscriptionPlanSummary)}>{subscriptionPlan.name} - {subscriptionPlan.price_per_month_text}</span>
        </div>
      );
    });
  }

  render() {
    let modalProps = {
      onClose: this.handleOnCloseModal.bind(this),
      closeOnOutsideClick: true,
      className: css(styles.subscriptionPlanModal)
    };
    let continueButtonProps = {
      className: css(styles.continueButton),
      disabled: this.state.loading,
      onClick: this.handleOnClickSaveButton.bind(this),
    };
    let cancelButtonProps = {
      className: css(styles.cancelButton),
      disabled: this.state.loading,
      onClick: this.handleOnClickCancelButton.bind(this),
    };
    let continueButtonText = this.state.loading ? <span className="loadingSpinner" /> : 'Save';
    return (
      <Modal {...modalProps}>
        <div className={css(styles.subscriptionPlanModalContents)}>
          <button className={css(styles.closeButton)} onClick={this.handleOnCloseModal.bind(this)}>
            <img src={menuClosePng} srcSet={menuCloseSvg} />
          </button>
          <h2 className={css(styles.header)}>Select plan</h2>
          <div>
            {this.renderError()}
            <div className={css(styles.subscriptionPlanList)}>
              {this.renderSubscriptionPlans()}
            </div>
          </div>
          <button {...continueButtonProps}>{continueButtonText}</button>
          <button {...cancelButtonProps}>Cancel subscription</button>
        </div>
      </Modal>
    );
  }
}

export let undecorated = SubscriptionPlanModal;

SubscriptionPlanModal = connectToStores(SubscriptionPlanModal, [SubscriptionPlansStore, SubscriptionsStore], (context, props) => {
  let subscriptionPlansStore = context.getStore(SubscriptionPlansStore);
  let subscriptionsStore = context.getStore(SubscriptionsStore);
  let {state: updateSubscriptionRequestState, error: updateSubscriptionRequestError} = subscriptionsStore.getEventData('UPDATE');
  return {
    subscriptionPlans: subscriptionPlansStore.getSubscriptionPlans(),
    updateSubscriptionRequestState,
    updateSubscriptionRequestError,
  };
});

export default SubscriptionPlanModal
