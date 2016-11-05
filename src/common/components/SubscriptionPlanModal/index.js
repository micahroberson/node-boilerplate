import React from 'react';
import {css} from 'aphrodite/no-important';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
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
    selectedSubscriptionPlanId: React.PropTypes.string,
    subscriptionPlans: React.PropTypes.array,
    loading: React.PropTypes.bool,
    error: React.PropTypes.object,
    onCancel: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
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
    return {
      error: props.error,
      loading: props.loading,
      selectedSubscriptionPlanId: props.selectedSubscriptionPlanId,
    };
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

  handleOnClickSaveButton(e) {
    this.setState({loading : true});
    this.props.onSave(this.state.selectedSubscriptionPlanId);
  }

  handleOnCloseModal() {
    this.props.onCancel();
  }

  renderError() {
    if(!this.state.error) {return null;}
    return <span className={css(styles.error)}>{this.state.error.message}</span>;
  }

  renderSubscriptionPlans(subscriptionPlans) {
    return subscriptionPlans.map((subscriptionPlan) => {

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
      disabled: disabled,
      onClick: this.handleOnClickSaveButton.bind(this)
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
            <div>
              {this.renderSubscriptionPlans(this.props.subscriptionPlans)}
            </div>
          </div>
          <button {...continueButtonProps}>{continueButtonText}</button>
        </div>
      </Modal>
    );
  }
}

export default SubscriptionPlanModal
