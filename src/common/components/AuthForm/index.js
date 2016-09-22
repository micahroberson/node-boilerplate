import _ from 'lodash';
import React from 'react';
import {Link} from 'react-router';
import {css} from 'aphrodite/no-important';
import connectToStores from 'fluxible-addons-react/connectToStores';
import UserActions from '../../actions/UserActions';
import UserStore, {RequestStates} from '../../stores/UserStore';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import styles from './styles';

export const Modes = {
  SignIn: 'sign_in',
  SignUp: 'sign_up',
  // ResetPassword: 'reset_password'
};

const ModeEventMap = {
  [Modes.SignIn]: 'SIGN_IN',
  [Modes.SignUp]: 'SIGN_UP',
  [Modes.ResetPassword]: 'SEND_PASSWORD_RESET_EMAIL'
};

class AuthForm extends React.Component {
  static propTypes = {
    requestState: React.PropTypes.string,
    error: React.PropTypes.object,
    mode: React.PropTypes.oneOf(_.values(Modes))
  };

  static defaultProps = {
    mode: Modes.SignIn
  };

  static contextTypes = {
    executeAction: React.PropTypes.func
  };

  shouldComponentUpdate = shouldComponentUpdatePure;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      loading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.loading && (nextProps.requestState !== RequestStates.Started)) {
      this.setState({loading: false});
    }
  }

  signIn() {
    this.setState({loading: true});
    this.context.executeAction(UserActions.signIn, {
      email: this.state.email,
      password: this.state.password
    });
  }

  signUp() {
    this.setState({loading: true});
    this.context.executeAction(UserActions.signUp, {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    });
  }

  // resetPassword() {
  //   this.setState({loading: true});
  //   this.context.executeAction(UserActions.sendPasswordResetEmail, {
  //     email: this.state.email
  //   });
  // }

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
    switch(this.props.mode) {
      case Modes.SignIn:
        return this.signIn();
      case Modes.SignUp:
        return this.signUp();
      // case Modes.ResetPassword:
      //   return this.resetPassword();
    }
  }

  handleOnSubmitForm(e) {
    this.signIn();
  }

  renderError() {
    let {requestState, error} = this.props;
    if(!error) {return;}
    return <h4 className={css(styles.error)}>{error.message}</h4>;
  }

  render() {
    let {name, email, password, loading} = this.state;
    let {mode} = this.props;
    let headerText, buttonText, altModeLinks, fieldsets;
    let nameInputProps = {
      className: css(styles.input),
      type: 'name',
      placeholder: 'Your full name',
      value: name,
      onChange: this.handleOnChangeName.bind(this)
    };
    let nameFieldset = (
      <fieldset key="nameFieldset">
        <label>Name</label>
        <input {...nameInputProps} />
      </fieldset>
    );
    let emailInputProps = {
      className: css(styles.input),
      type: 'email',
      placeholder: 'Your email address',
      value: email,
      onChange: this.handleOnChangeEmail.bind(this)
    };
    let emailFieldset = (
      <fieldset key="emailFieldset">
        <label>Email</label>
        <input {...emailInputProps} />
      </fieldset>
    );
    let passwordInputProps = {
      className: css(styles.input),
      type: 'password',
      placeholder: 'Your password',
      value: password,
      onChange: this.handleOnChangePassword.bind(this)
    };
    let passwordFieldset = (
      <fieldset key="passwordFieldset">
        <label>Password</label>
        <input {...passwordInputProps} />
      </fieldset>
    );
    let submitButtonProps = {
      className: `blue ${css(styles.submitButton)}`,
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
        buttonText = headerText = 'Sign in';
        fieldsets = [emailFieldset, passwordFieldset];
        altModeLinks = [
          <p key="signUpLink" className={css(styles.altLinkWrapper)}>Not registered? <Link {...signUpLinkProps}>Sign up</Link></p>
        ];
        break;
      case Modes.SignUp:
        buttonText = headerText = 'Sign up';
        fieldsets = [nameFieldset, emailFieldset, passwordFieldset];
        altModeLinks = [
          <p key="signInLink" className={css(styles.altLinkWrapper)}>Already have an account? <Link {...signInLinkProps}>Sign in</Link></p>
        ];
        break;
      // case Modes.ResetPassword:
      //   break;
      //<Link {...forgotPasswordLinkProps}>Forgot your password?</Link>
    }
    return (
      <div className={css(styles.signIn)}>
        <h1 className={css(styles.signInHeader)}>{headerText}</h1>
        {this.renderError()}
        <form onSubmit={this.handleOnSubmitForm.bind(this)}>
          {fieldsets}
          <div className="cf">
            <button {...submitButtonProps}>{buttonText}</button>
            {altModeLinks}
          </div>
        </form>
      </div>
    );
  }
}

AuthForm = connectToStores(AuthForm, [UserStore], (context, props) => {
  let {state, error} = context.getStore(UserStore).getEventData(ModeEventMap[props.mode]);
  return {
    requestState: state,
    error: error
  };
});

export default AuthForm
