import React from 'react';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import AuthForm, {Modes} from '../AuthForm';

class ResetPassword extends React.Component {
  shouldComponentUpdate = shouldComponentUpdatePure;

  render() {
    let authFormProps = {
      mode: Modes.ResetPassword,
      passwordResetToken: this.props.routeParams.token
    };
    return <AuthForm {...authFormProps} />;
  }
}

export default ResetPassword
