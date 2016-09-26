import React from 'react';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import AuthForm, {Modes} from '../AuthForm';

class ForgotPassword extends React.Component {
  shouldComponentUpdate = shouldComponentUpdatePure;

  render() {
    return <AuthForm mode={Modes.ForgotPassword} />;
  }
}

export default ForgotPassword
