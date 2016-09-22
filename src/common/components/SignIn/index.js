import React from 'react';
import shouldComponentUpdatePure from '../../lib/shouldComponentUpdatePure';
import AuthForm, {Modes} from '../AuthForm';

class SignIn extends React.Component {
  shouldComponentUpdate = shouldComponentUpdatePure;

  render() {
    return <AuthForm mode={Modes.SignIn} />;
  }
}

export default SignIn
