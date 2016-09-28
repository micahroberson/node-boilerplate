jest.unmock('./userActions');
jest.unmock('../models/User');
jest.mock('react-router');

import _ from 'lodash';
import {spy, stub} from 'sinon';
import userActions from './userActions';
import User from '../models/User';
import Promise from 'bluebird';
import {browserHistory} from 'react-router';

let userJSON = {
  "user": {
    "id": "55c3b61d7e98216e64e6cc83",
    "name": "Test User",
    "email": "test@example.com"
  }
};

let context = {
  dispatch: () => {},
  api: {
    setSessionToken: () => {},
    users: {
      signIn: () => {return Promise.resolve(userJSON)},
      create: () => {return Promise.resolve(userJSON)},
      me: () => {return Promise.resolve(userJSON)},
      update: (payload) => {return Promise.resolve(_.merge({}, userJSON, {user: payload}))},
      sendPasswordResetEmail: () => {return Promise.resolve({})},
      resetPassword: () => {return Promise.resolve({})}
    }
  }
};

describe('userActions', () => {
  let contextSpy;

  beforeAll(() => {
    contextSpy = spy(context, 'dispatch');
  });

  beforeEach(() => {
    contextSpy.reset();
    browserHistory.push.mockClear();
  });

  describe('#signIn', () => {
    let validPayload = {email: userJSON.user.email, password: 'password'};

    it('dispatches a start event', () => {
      userActions.signIn(context, {});
      expect(context.dispatch.calledWith('USER_SIGN_IN_START')).toBeTruthy();
    });

    describe('when an invalid payload is provided', () => {
      describe('when email is invalid', () => {
        it('dispatches an error', () => {
          userActions.signIn(context, {email: 'asd', password: 'password'});
          expect(context.dispatch.calledWith('USER_SIGN_IN_FAILURE')).toBeTruthy();
        });
      });

      describe('when password is invalid', () => {
        it('dispatches an error', () => {
          userActions.signIn(context, {email: 'test@example.com', password: ''});
          expect(context.dispatch.calledWith('USER_SIGN_IN_FAILURE')).toBeTruthy();
        });
      });
    });

    describe('when a valid payload is provided', () => {
      it('returns a promise', () => {
        expect(userActions.signIn(context, validPayload) instanceof Promise).toBeTruthy();
      });

      it('calls api.users.signIn', () => {
        spy(context.api.users, 'signIn');
        return userActions.signIn(context, validPayload)
          .then(() => {
            expect(context.api.users.signIn.calledOnce).toBeTruthy();
            expect(context.api.users.signIn.calledWith(validPayload)).toBeTruthy();
            context.api.users.signIn.restore();
          });
      });

      describe('when successful', () => {
        it('instantiates a User, dispatches the success event, and redirects to "/"', () => {
          return userActions.signIn(context, validPayload)
            .then((user) => {
              expect(context.dispatch.calledWith('USER_SIGN_IN_SUCCESS', user)).toBeTruthy();
              expect(user instanceof User).toBeTruthy();
              expect(user.email).toBe(userJSON.user.email);
              expect(browserHistory.push.mock.calls.length).toBe(1);
              expect(browserHistory.push.mock.calls[0]).toContain('/');
            });
        });
      });

      describe('when unsuccessful', () => {
        it('dispatches the failure event', () => {
          let signInStub = stub(context.api.users, 'signIn', () => {
            return Promise.reject(new Error({message: 'Error message'}));
          });
          return userActions.signIn(context, validPayload)
            .then(() => {
              expect(context.dispatch.calledWith('USER_SIGN_IN_FAILURE')).toBeTruthy();
              signInStub.restore();
            });
        });
      });
    });
  });

  describe('#signUp', () => {
    let validPayload = {
      name: userJSON.user.name,
      email: userJSON.user.email,
      password: 'password'
    };

    it('dispatches a start event', () => {
      userActions.signUp(context, {});
      expect(context.dispatch.calledWith('USER_SIGN_UP_START')).toBeTruthy();
    });

    describe('when an invalid payload is provided', () => {
      describe('when email is invalid', () => {
        it('dispatches an error', () => {
          userActions.signUp(context, {name: 'test', email: 'asd', password: 'password'});
          expect(context.dispatch.calledWith('USER_SIGN_UP_FAILURE')).toBeTruthy();
        });
      });

      describe('when password is invalid', () => {
        it('dispatches an error', () => {
          userActions.signUp(context, {name: 'test', email: 'test@example.com', password: ''});
          expect(context.dispatch.calledWith('USER_SIGN_UP_FAILURE')).toBeTruthy();
        });
      });
    });

    describe('when a valid payload is provided', () => {
      it('returns a promise', () => {
        expect(userActions.signUp(context, validPayload) instanceof Promise).toBeTruthy();
      });

      it('calls api.users.signUp', () => {
        spy(context.api.users, 'create');
        return userActions.signUp(context, validPayload)
          .then(() => {
            expect(context.api.users.create.calledOnce).toBeTruthy();
            expect(context.api.users.create.calledWith(validPayload)).toBeTruthy();
            context.api.users.create.restore();
          });
      });

      describe('when successful', () => {
        it('instantiates a User, dispatches the success event, and redirects to "/"', () => {
          return userActions.signUp(context, validPayload)
            .then((user) => {
              expect(context.dispatch.calledWith('USER_SIGN_UP_SUCCESS', user)).toBeTruthy();
              expect(user instanceof User).toBeTruthy();
              expect(user.email).toBe(userJSON.user.email);
              expect(browserHistory.push.mock.calls.length).toBe(1);
              expect(browserHistory.push.mock.calls[0]).toContain('/');
            });
        });
      });

      describe('when unsuccessful', () => {
        it('dispatches the failure event', () => {
          let signUpStub = stub(context.api.users, 'create', () => {
            return Promise.reject(new Error({message: 'Error message'}));
          });
          return userActions.signUp(context, validPayload)
            .then(() => {
              expect(context.dispatch.calledWith('USER_SIGN_UP_FAILURE')).toBeTruthy();
              signUpStub.restore();
            });
        });
      });
    });
  });

  describe('#me', () => {
    let validPayload = {};

    it('dispatches a start event', () => {
      userActions.me(context, {});
      expect(context.dispatch.calledWith('USER_ME_START')).toBeTruthy();
    });

    it('returns a promise', () => {
      expect(userActions.me(context, validPayload) instanceof Promise).toBeTruthy();
    });

    it('calls api.users.me', () => {
      spy(context.api.users, 'me');
      return userActions.me(context, validPayload)
        .then(() => {
          expect(context.api.users.me.calledOnce).toBeTruthy();
          expect(context.api.users.me.calledWith(validPayload)).toBeTruthy();
          context.api.users.me.restore();
        });
    });

    describe('when successful', () => {
      it('instantiates a User and dispatches the success event', () => {
        return userActions.me(context, validPayload)
          .then((user) => {
            expect(context.dispatch.calledWith('USER_ME_SUCCESS', user)).toBeTruthy();
            expect(user instanceof User).toBeTruthy();
            expect(user.email).toBe(userJSON.user.email);
          });
      });
    });

    describe('when unsuccessful', () => {
      it('dispatches the failure event', () => {
        let meStub = stub(context.api.users, 'me', () => {
          return Promise.reject(new Error({message: 'Error message'}));
        });
        return userActions.me(context, validPayload)
          .then(() => {
            expect(context.dispatch.calledWith('USER_ME_FAILURE')).toBeTruthy();
            meStub.restore();
          });
      });
    });
  });

  describe('#update', () => {
    let validPayload = {
      name: 'New test name'
    };

    it('dispatches a start event', () => {
      userActions.update(context, {});
      expect(context.dispatch.calledWith('USER_UPDATE_START')).toBeTruthy();
    });

    describe('when an invalid payload is provided', () => {});

    describe('when a valid payload is provided', () => {
      it('returns a promise', () => {
        expect(userActions.update(context, validPayload) instanceof Promise).toBeTruthy();
      });

      it('calls api.users.update', () => {
        spy(context.api.users, 'update');
        return userActions.update(context, validPayload)
          .then(() => {
            expect(context.api.users.update.calledOnce).toBeTruthy();
            expect(context.api.users.update.calledWith(validPayload)).toBeTruthy();
            context.api.users.update.restore();
          });
      });

      describe('when successful', () => {
        it('instantiates a User and dispatches the success event', () => {
          return userActions.update(context, validPayload)
            .then((user) => {
              expect(context.dispatch.calledWith('USER_UPDATE_SUCCESS', user)).toBeTruthy();
              expect(user instanceof User).toBeTruthy();
              expect(user.name).toBe(validPayload.name);
            });
        });
      });

      describe('when unsuccessful', () => {
        it('dispatches the failure event', () => {
          let updateStub = stub(context.api.users, 'update', () => {
            return Promise.reject(new Error({message: 'Error message'}));
          });
          return userActions.update(context, validPayload)
            .then(() => {
              expect(context.dispatch.calledWith('USER_UPDATE_FAILURE')).toBeTruthy();
              updateStub.restore();
            });
        });
      });
    });
  });

  describe('#sendPasswordResetEmail', () => {
    let validPayload = {
      email: userJSON.user.email
    };

    it('dispatches a start event', () => {
      userActions.sendPasswordResetEmail(context, {});
      expect(context.dispatch.calledWith('USER_SEND_PASSWORD_RESET_EMAIL_START')).toBeTruthy();
    });

    describe('when an invalid payload is provided', () => {
      describe('when email is invalid', () => {
        it('dispatches an error', () => {
          userActions.sendPasswordResetEmail(context, {email: 'asd'});
          expect(context.dispatch.calledWith('USER_SEND_PASSWORD_RESET_EMAIL_FAILURE')).toBeTruthy();
        });
      });
    });

    describe('when a valid payload is provided', () => {
      it('returns a promise', () => {
        expect(userActions.sendPasswordResetEmail(context, validPayload) instanceof Promise).toBeTruthy();
      });

      it('calls api.users.sendPasswordResetEmail', () => {
        spy(context.api.users, 'sendPasswordResetEmail');
        return userActions.sendPasswordResetEmail(context, validPayload)
          .then(() => {
            expect(context.api.users.sendPasswordResetEmail.calledOnce).toBeTruthy();
            expect(context.api.users.sendPasswordResetEmail.calledWith(validPayload)).toBeTruthy();
            context.api.users.sendPasswordResetEmail.restore();
          });
      });

      describe('when successful', () => {
        it('instantiates a User and dispatches the success event', () => {
          return userActions.sendPasswordResetEmail(context, validPayload)
            .then(() => {
              expect(context.dispatch.calledWith('USER_SEND_PASSWORD_RESET_EMAIL_SUCCESS')).toBeTruthy();
            });
        });
      });

      describe('when unsuccessful', () => {
        it('dispatches the failure event', () => {
          let sendPasswordResetEmailStub = stub(context.api.users, 'sendPasswordResetEmail', () => {
            return Promise.reject(new Error({message: 'Error message'}));
          });
          return userActions.sendPasswordResetEmail(context, validPayload)
            .then(() => {
              expect(context.dispatch.calledWith('USER_SEND_PASSWORD_RESET_EMAIL_FAILURE')).toBeTruthy();
              sendPasswordResetEmailStub.restore();
            });
        });
      });
    });
  });

  describe('#resetPassword', () => {
    let validPayload = {
      password: 'password',
      password_reset_token: 'C_egX_APu7DnUrkZkH4VilvSy8U9uLXbt6wdtR_dzlo'
    };

    it('dispatches a start event', () => {
      userActions.resetPassword(context, {});
      expect(context.dispatch.calledWith('USER_RESET_PASSWORD_START')).toBeTruthy();
    });

    describe('when an invalid payload is provided', () => {
      describe('when no password is provided', () => {
        it('dispatches an error', () => {
          userActions.resetPassword(context, {password: '', password_reset_token: 'asdfasdf'});
          expect(context.dispatch.calledWith('USER_RESET_PASSWORD_FAILURE')).toBeTruthy();
        });
      });

      describe('when no password_reset_token is provided', () => {
        it('dispatches an error', () => {
          userActions.resetPassword(context, {password: 'asdasff', password_reset_token: ''});
          expect(context.dispatch.calledWith('USER_RESET_PASSWORD_FAILURE')).toBeTruthy();
        });
      });
    });

    describe('when a valid payload is provided', () => {
      it('returns a promise', () => {
        expect(userActions.resetPassword(context, validPayload) instanceof Promise).toBeTruthy();
      });

      it('calls api.users.resetPassword', () => {
        spy(context.api.users, 'resetPassword');
        return userActions.resetPassword(context, validPayload)
          .then(() => {
            expect(context.api.users.resetPassword.calledOnce).toBeTruthy();
            expect(context.api.users.resetPassword.calledWith(validPayload)).toBeTruthy();
            context.api.users.resetPassword.restore();
          });
      });

      describe('when successful', () => {
        it('instantiates a User and dispatches the success event', () => {
          return userActions.resetPassword(context, validPayload)
            .then(() => {
              expect(context.dispatch.calledWith('USER_RESET_PASSWORD_SUCCESS')).toBeTruthy();
            });
        });
      });

      describe('when unsuccessful', () => {
        it('dispatches the failure event', () => {
          let resetPasswordStub = stub(context.api.users, 'resetPassword', () => {
            return Promise.reject(new Error({message: 'Error message'}));
          });
          return userActions.resetPassword(context, validPayload)
            .then(() => {
              expect(context.dispatch.calledWith('USER_RESET_PASSWORD_FAILURE')).toBeTruthy();
              resetPasswordStub.restore();
            });
        });
      });
    });
  });
});
