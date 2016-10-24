import _ from 'lodash';
import React from 'react';
import {Link} from 'react-router';
import {css} from 'aphrodite/no-important';
import connectToStores from 'fluxible-addons-react/connectToStores';
import userActions from '../../actions/userActions';
import UsersStore from '../../stores/UsersStore';
import {RequestStates} from '../../stores/BaseStore';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import styles from './styles';

export const Modes = {
  SignIn: 'sign_in',
  SignUp: 'sign_up',
  ForgotPassword: 'forgot_password',
  ResetPassword: 'reset_password',
  ResetPasswordLinkSent: 'reset_password_link_sent',
  PasswordUpdated: 'password_updated'
};

const ModeEventMap = {
  [Modes.SignIn]: 'SIGN_IN',
  [Modes.SignUp]: 'SIGN_UP',
  [Modes.ForgotPassword]: 'SEND_PASSWORD_RESET_EMAIL',
  [Modes.ResetPassword]: 'RESET_PASSWORD'
};

class AuthForm extends React.Component {
  static propTypes = {
    requestState: React.PropTypes.string,
    requestError: React.PropTypes.object,
    mode: React.PropTypes.oneOf(_.values(Modes)),
    passwordResetToken: React.PropTypes.string // If mode == ResetPassword
  };

  static defaultProps = {
    mode: Modes.SignIn
  };

  static contextTypes = {
    executeAction: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = _.extend({
      name: '',
      email: '',
      password: '',
      loading: false
    }, this.getStateFromProps(props));
  }

  shouldComponentUpdate = shouldComponentUpdatePure;

  componentWillReceiveProps(nextProps) {
    if(this.props.requestState !== nextProps.requestState) {
      this.setState({loading: nextProps.requestState === RequestStates.Started});
    }
    if(this.props.mode !== nextProps.mode) {
      this.setState({mode: nextProps.mode});
    }
    if(this.props.mode === Modes.ForgotPassword &&
      this.props.requestState === RequestStates.Started &&
      nextProps.requestState === RequestStates.Success) {
      this.setState({mode: Modes.ResetPasswordLinkSent});
    } else if(this.props.mode === Modes.ResetPassword &&
      this.props.requestState === RequestStates.Started &&
      nextProps.requestState === RequestStates.Success) {
      this.setState({mode: Modes.PasswordUpdated});
    }
  }

  getStateFromProps(props) {
    return {mode: props.mode};
  }

  submit() {
    switch(this.state.mode) {
      case Modes.SignIn:
        return this.signIn();
      case Modes.SignUp:
        return this.signUp();
      case Modes.ForgotPassword:
        return this.sendPasswordResetEmail();
      case Modes.ResetPassword:
        return this.resetPassword();
    }
  }

  signIn() {
    this.setState({loading: true});
    this.context.executeAction(userActions.signIn, {
      email: this.state.email,
      password: this.state.password
    });
  }

  signUp() {
    this.setState({loading: true});
    this.context.executeAction(userActions.signUp, {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    });
  }

  sendPasswordResetEmail() {
    this.setState({loading: true});
    this.context.executeAction(userActions.sendPasswordResetEmail, {
      email: this.state.email
    });
  }

  resetPassword() {
    this.setState({loading: true});
    this.context.executeAction(userActions.resetPassword, {
      password: this.state.password,
      password_reset_token: this.props.passwordResetToken
    });
  }

  handleOnChangeEmail(e) {
    this.setState({email: e.target.value});
  }

  handleOnChangePassword(e) {
    this.setState({password: e.target.value});
  }

  handleOnChangeName(e) {
    this.setState({name: e.target.value});
  }

  handleOnClickSubmitButton(e) {
    this.submit();
  }

  handleOnSubmitForm(e) {
    e.stopPropagation();
    e.preventDefault();
    this.submit();
  }

  renderError() {
    let {requestState, requestError} = this.props;
    if(!requestError) {return;}
    return <h4 className={css(styles.error)}>{requestError.message}</h4>;
  }

  render() {
    let {name, email, password, loading, mode} = this.state;
    let headerText, subheaderText, buttonContents, altModeLinks, fieldsets;
    let nameInputProps = {
      className: css(styles.input),
      id: 'name',
      type: 'name',
      placeholder: 'Enter your full name',
      value: name,
      onChange: this.handleOnChangeName.bind(this)
    };
    let nameFieldset = (
      <fieldset key="nameFieldset">
        <label htmlFor="name">Name</label>
        <input {...nameInputProps} />
      </fieldset>
    );
    let emailInputProps = {
      className: css(styles.input),
      id: 'email',
      type: 'email',
      placeholder: 'Enter your email address',
      value: email,
      onChange: this.handleOnChangeEmail.bind(this)
    };
    let emailFieldset = (
      <fieldset key="emailFieldset">
        <label htmlFor="email">Email</label>
        <input {...emailInputProps} />
      </fieldset>
    );
    let passwordInputProps = {
      className: css(styles.input),
      id: 'password',
      type: 'password',
      placeholder: 'Enter a password',
      value: password,
      onChange: this.handleOnChangePassword.bind(this)
    };
    let passwordFieldset = (
      <fieldset key="passwordFieldset">
        <label htmlFor="password">Password</label>
        <input {...passwordInputProps} />
      </fieldset>
    );
    let submitButtonProps = {
      className: `jellyBean ${css(styles.submitButton)}`,
      type: 'submit',
      disabled: loading,
      onClick: this.handleOnClickSubmitButton.bind(this)
    };
    let signUpLinkProps = {
      className: css(styles.altLink),
      to: "/sign-up"
    };
    let signInLinkProps = {
      className: css(styles.altLink),
      to: "/sign-in"
    };
    let forgotPasswordLinkProps = {
      className: css(styles.altLink),
      to: "/forgot-password"
    };

    switch(mode) {
      case Modes.SignIn:
        buttonContents = headerText = 'Sign in';
        fieldsets = [emailFieldset, passwordFieldset];
        altModeLinks = [
          <p key="signUpLink" className={css(styles.altLinkWrapper)}>Not registered? <Link {...signUpLinkProps}>Sign up</Link></p>,
          <p key="forgotPasswordLink" className={css(styles.altLinkWrapper)}>Forgot password? <Link {...forgotPasswordLinkProps}>Reset it</Link></p>
        ];
        break;
      case Modes.SignUp:
        buttonContents = headerText = 'Sign up';
        fieldsets = [nameFieldset, emailFieldset, passwordFieldset];
        altModeLinks = [
          <p key="signInLink" className={css(styles.altLinkWrapper)}>Already have an account? <Link {...signInLinkProps}>Sign in</Link></p>,
          <p key="forgotPasswordLink" className={css(styles.altLinkWrapper)}>Forgot password? <Link {...forgotPasswordLinkProps}>Reset it</Link></p>
        ];
        break;
      case Modes.ForgotPassword:
        buttonContents = headerText = 'Send reset password instructions';
        fieldsets = [emailFieldset];
        altModeLinks = [
          <p key="signInLink" className={css(styles.altLinkWrapper)}>Already have an account? <Link {...signInLinkProps}>Sign in</Link></p>,
          <p key="signUpLink" className={css(styles.altLinkWrapper)}>Not registered? <Link {...signUpLinkProps}>Sign up</Link></p>
        ];
        break;
      case Modes.ResetPassword:
        buttonContents = headerText = 'Reset my password';
        fieldsets = [passwordFieldset];
        break;
      case Modes.ResetPasswordLinkSent:
        headerText = 'Send reset password instructions';
        subheaderText = `We've emailed instructions for resetting your password to ${email}. Please check for email to proceed.`;
        break;
      case Modes.PasswordUpdated:
        headerText = 'Reset my password';
        subheaderText = `You're password has been updated successfullly. You may now login with your email and new password.`;
        break;
    }

    if(loading) {
      buttonContents = <span className="loadingSpinner" />;
    }

    return (
      <div className={css(styles.authForm)}>
        <h1 className={css(styles.authFormHeader)}>{headerText}</h1>
        {subheaderText ? <p className={css(styles.subheader)}>{subheaderText}</p> : null}
        {this.renderError()}
        <form onSubmit={this.handleOnSubmitForm.bind(this)}>
          {fieldsets}
          <div className={css(styles.buttonWrapper)}>
            {buttonContents ? <button {...submitButtonProps}>{buttonContents}</button> : null}
          </div>
          {altModeLinks}
        </form>
      </div>
    );
  }
}

export let undecorated = AuthForm;

AuthForm = connectToStores(AuthForm, [UsersStore], (context, props) => {
  let {state, error} = context.getStore(UsersStore).getEventData(ModeEventMap[props.mode]);
  return {
    requestState: state,
    requestError: error
  };
});

export default AuthForm
