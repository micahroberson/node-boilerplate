jest.unmock('../styles');
jest.unmock('../index');
jest.unmock('../../../lib/shouldComponentUpdatePure');

import {mount} from 'enzyme';
import React from 'react';
import {spy} from 'sinon';
import {RequestStates} from '../../../stores/UserStore';
import userActions from '../../../actions/userActions';
import {undecorated as AuthForm, Modes} from '../index';
import styles from '../styles';
import {css, StyleSheetTestUtils} from 'aphrodite/no-important';
StyleSheetTestUtils.suppressStyleInjection();

let context = {
  executeAction: () => {}
};

describe('<AuthForm />', () => {
  let wrapper, instance;
  it('should render with default props', () => {
    wrapper = mount(<AuthForm />);
    expect(wrapper.props().mode).toEqual(Modes.SignIn);
  });

  it('updates the state when props change', () => {
    wrapper = mount(<AuthForm />);
    wrapper.setProps({mode: Modes.SignUp});
    expect(wrapper.props().mode).toEqual(Modes.SignUp);
  });

  describe('#submit', () => {
    let beforeEachHook = (mode) => {
      beforeEach(() => {
        wrapper = mount(<AuthForm mode={mode} />, {context});
        instance = wrapper.instance();
        spy(instance.context, 'executeAction');
      });
    };

    let submitAssertions = (action) => {
      expect(instance.context.executeAction.calledOnce).toBe(true);
      expect(instance.context.executeAction.calledWith(action)).toBe(true);
      expect(instance.state.loading).toBe(true);
    };

    describe('when mode is SignIn', () => {
      beforeEachHook(Modes.SignIn);

      describe('when the form is submitted', () => {
        it('executes the signIn action', () => {
          wrapper.find('form').simulate('submit');
          submitAssertions(userActions.signIn);
        });
      });

      describe('when the submit button is clicked', () => {
        it('executes the signIn action', () => {
          wrapper.find('button').simulate('click');
          submitAssertions(userActions.signIn);
        });
      });
    });

    describe('when mode is SignUp', () => {
      beforeEachHook(Modes.SignUp);

      describe('when the form is submitted', () => {
        it('executes the signUp action', () => {
          wrapper.find('form').simulate('submit');
          submitAssertions(userActions.signUp);
        });
      });

      describe('when the submit button is clicked', () => {
        it('executes the signUp action', () => {
          wrapper.find('button').simulate('click');
          submitAssertions(userActions.signUp);
        });
      });
    });

    describe('when mode is ForgotPassword', () => {
      beforeEachHook(Modes.ForgotPassword);

      describe('when the form is submitted', () => {
        it('executes the sendPasswordResetEmail action', () => {
          wrapper.find('form').simulate('submit');
          submitAssertions(userActions.sendPasswordResetEmail);
        });
      });

      describe('when the submit button is clicked', () => {
        it('executes the sendPasswordResetEmail action', () => {
          wrapper.find('button').simulate('click');
          submitAssertions(userActions.sendPasswordResetEmail);
        });
      });
    });
  });

  describe('#render', () => {
    describe('when the mode is SignIn', () => {
      beforeAll(() => {
        wrapper = mount(<AuthForm mode={Modes.SignIn} />, {context});
        instance = wrapper.instance();
      });

      it('renders the correct inputs', () => {
        expect(wrapper.find('#email').length).toBe(1);
        expect(wrapper.find('#password').length).toBe(1);
        expect(wrapper.find('#name').length).toBe(0);
      });

      it('renders the correct header', () => {
        expect(wrapper.find(`.${css(styles.authFormHeader)}`).length).toBe(1);
        expect(wrapper.find(`.${css(styles.authFormHeader)}`).text()).toContain('Sign in');
      });
    });

    describe('when the mode is SignUp', () => {
      beforeAll(() => {
        wrapper = mount(<AuthForm mode={Modes.SignUp} />, {context});
        instance = wrapper.instance();
      });

      it('renders the correct inputs', () => {
        expect(wrapper.find('#email').length).toBe(1);
        expect(wrapper.find('#password').length).toBe(1);
        expect(wrapper.find('#name').length).toBe(1);
      });

      it('renders the correct header', () => {
        expect(wrapper.find(`.${css(styles.authFormHeader)}`).length).toBe(1);
        expect(wrapper.find(`.${css(styles.authFormHeader)}`).text()).toContain('Sign up');
      });
    });

    describe('when the mode is ForgotPassword', () => {
      beforeAll(() => {
        wrapper = mount(<AuthForm mode={Modes.ForgotPassword} />, {context});
        instance = wrapper.instance();
      });

      it('renders the correct inputs', () => {
        expect(wrapper.find('#email').length).toBe(1);
        expect(wrapper.find('#password').length).toBe(0);
        expect(wrapper.find('#name').length).toBe(0);
      });

      it('renders the correct header', () => {
        expect(wrapper.find(`.${css(styles.authFormHeader)}`).length).toBe(1);
        expect(wrapper.find(`.${css(styles.authFormHeader)}`).text()).toContain('Send reset password instructions');
      });
    });

    describe('when props.requestState changes to RequestStates.Started', () => {
      it('disables the submit button', () => {
        wrapper.setProps({requestState: RequestStates.Started});
        expect(wrapper.find('button').first().props().disabled).toBe(true);
      });
    });

    describe('when props.requestState changes to RequestStates.Success', () => {
      it('disables the submit button', () => {
        wrapper.setProps({requestState: RequestStates.Started});
        wrapper.setProps({requestState: RequestStates.Success});
        expect(wrapper.find('button').first().props().disabled).toBe(false);
      });
    });

    describe('when props.requestState changes to RequestStates.Failure', () => {
      beforeAll(() => {
        wrapper = mount(<AuthForm mode={Modes.SignIn} />, {context});
        wrapper.setProps({requestState: RequestStates.Started});
        wrapper.setProps({
          requestState: RequestStates.Failure,
          error: {message: 'Error message'}
        });
      });

      it('disables the submit button', () => {
        expect(wrapper.find('button').first().props().disabled).toBe(false);
      });

      it('displays the error', () => {
        let elems = wrapper.find(`.${css(styles.error)}`);
        expect(elems.length).toBe(1);
        expect(elems.text()).toContain('Error message');
      })
    });
  });
});
