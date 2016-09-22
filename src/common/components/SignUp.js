import React from 'react';
import shouldComponentUpdatePure from '../lib/shouldComponentUpdatePure';
import AuthForm, {Modes} from './AuthForm';

class SignUp extends React.Component {
  shouldComponentUpdate = shouldComponentUpdatePure;

  render() {
    return <AuthForm mode={Modes.SignUp} />;
  }
}

export default SignUp;
