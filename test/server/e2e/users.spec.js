import {shouldRequireAuthentication} from '../setup';
import usersJson from '../../fixtures/users.json';
import userSessionsJson from '../../fixtures/user_sessions.json';

const TestUser1 = usersJson[0];
const TestUser2 = usersJson[1];
const TestUser1AuthHeader = ['Authorization', `Bearer ${new Buffer(userSessionsJson[0].id).toString('base64')}`];
const TestUser2AuthHeader = ['Authorization', `Bearer ${new Buffer(userSessionsJson[1].id).toString('base64')}`];

describe('/users', () => {
  describe('/create', () => {
    before(() => {
      return loadFixtures('users');
    });
    after(() => {
      return unloadFixtures('user_sessions', 'all_teams', 'all_users');
    });
    describe('when an invalid payload is provided', () => {
      describe('when the email is already taken', () => {
        it('responds with an error', (done) => {
          request
            .post('/api/users/create')
            .send({
              payload: {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password'
              }
            })
            .expect((res) => {
              expect(res.body).to.have.property('success');
              expect(res.body.success).to.be.false;
              expect(res.body).to.have.property('error');
              expect(res.body.error.name).to.equal('ParametersInvalidError');
            })
            .end(done);
        });
      });
      describe('when a parameter is missing', () => {
        it('responds with an error', (done) => {
          request
            .post('/api/users/create')
            .send({
              payload: {
                name: null,
                email: 'test100@example.com',
                password: 'password'
              }
            })
            .expect((res) => {
              expect(res.body).to.have.property('success');
              expect(res.body.success).to.be.false;
              expect(res.body).to.have.property('error');
              expect(res.body.error.name).to.equal('ParametersInvalidError');
            })
            .end(done);
        });
      });
    });
    describe('when a valid email & password are provided', () => {
      it('responds with a session_token and user', (done) => {
        request
          .post('/api/users/create')
          .send({
            payload: {
              name: 'Test User 2',
              email: 'test45@example.com',
              password: 'password'
            }
          })
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.have.property('user');
            expect(res.body.payload.user).to.have.property('email');
            expect(res.body.payload.user.email).to.equal('test45@example.com');
            expect(res.body.payload).to.have.property('session_token');
          })
          .end(done);
      });
    });
  });
  describe('/sign-in', () => {
    before(() => {
      return loadFixtures('users');
    });
    after(() => {
      return unloadFixtures('user_sessions', 'all_teams', 'all_users');
    });
    describe('when an invalid email & password are provided', () => {
      it('responds with an error', (done) => {
        request
          .post('/api/users/sign-in')
          .send({
            payload: {
              email: 'example@example.com',
              password: 'password'
            }
          })
          .expect(200, {
            success: false,
            error: {
              name: 'ParametersInvalidError',
              message: 'The email/password combination you provided is invalid.'
            }
          }, done);
      });
    });
    describe('when a valid email & password are provided', () => {
      it('responds with a session_token and user', (done) => {
        request
          .post('/api/users/sign-in')
          .send({
            payload: {
              email: 'test@example.com',
              password: 'password'
            }
          })
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.have.property('user');
            expect(res.body.payload.user).to.have.property('email');
            expect(res.body.payload.user.email).to.equal('test@example.com');
            expect(res.body.payload).to.have.property('session_token');
          })
          .end(done);
      });
    });
  });
  describe('/me', () => {
    shouldRequireAuthentication('/api/users/me');
    before(() => {
      return loadFixtures('users', 'user_sessions');
    });
    after(() => {
      return unloadFixtures('user_sessions', 'all_teams', 'all_users');
    });
    describe('when a valid email & password are provided', () => {
      it('responds with a session_token and user', (done) => {
        request
          .post('/api/users/me')
          .set(...TestUser1AuthHeader)
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.have.property('user');
            expect(res.body.payload.user).to.have.property('email');
            expect(res.body.payload.user.email).to.equal('test@example.com');
          })
          .end(done);
      });
    });
  });
  describe('/update', () => {
    shouldRequireAuthentication('/api/users/update');
    before(() => {
      return loadFixtures('users', 'user_sessions');
    });
    after(() => {
      return unloadFixtures('user_sessions', 'all_teams', 'all_users');
    });
    describe('when a valid email & password are provided', () => {
      it('responds with the updated user', (done) => {
        request
          .post('/api/users/update')
          .set(...TestUser1AuthHeader)
          .send({
            payload: {
              id: TestUser1.id,
              name: 'New Name'
            }
          })
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.have.property('user');
            expect(res.body.payload.user).to.have.property('name');
            expect(res.body.payload.user.name).to.equal('New Name');
          })
          .end(done);
      });
    });
  });
  describe('/send-password-reset-email', () => {
    before(() => {
      return loadFixtures('users');
    });
    after(() => {
      return unloadFixtures('user_sessions', 'all_teams', 'all_users');
    });
    describe('when an invalid email is provided', () => {
      it('responds with an error', (done) => {
        request
          .post('/api/users/send-password-reset-email')
          .send({
            payload: {
              email: ''
            }
          })
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('name');
            expect(res.body.error.name).to.equal('ParametersInvalidError');
          })
          .end(done);
      });
    });
    describe('when a valid email is provided', () => {
      it('responds with success', (done) => {
        request
          .post('/api/users/send-password-reset-email')
          .send({
            payload: {
              email: 'test@example.com'
            }
          })
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.deep.equal({});
          })
          .end(done);
      });
    });
  });
  describe('/reset-password', () => {
    before(() => {
      return loadFixtures('users');
    });
    after(() => {
      return unloadFixtures('user_sessions', 'all_teams', 'all_users');
    });
    describe('when an invalid token is provided', () => {
      it('responds with an error', (done) => {
        request
          .post('/api/users/reset-password')
          .send({
            payload: {
              password_reset_token: '12345',
              password: 'password2'
            }
          })
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('name');
            expect(res.body.error.name).to.equal('ParametersInvalidError');
            expect(res.body.error.message).to.match(/invalid/);
          })
          .end(done);
      });
    });
    describe('when an expired token is provided', () => {
      it('responds with an error', (done) => {
        request
          .post('/api/users/reset-password')
          .send({
            payload: {
              password_reset_token: TestUser2.password_reset_token,
              password: 'password2'
            }
          })
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('name');
            expect(res.body.error.name).to.equal('ParametersInvalidError');
            expect(res.body.error.message).to.match(/expired/);
          })
          .end(done);
      });
    });
    describe('when a valid token is provided', () => {
      it('responds with success', (done) => {
        request
          .post('/api/users/reset-password')
          .send({
            payload: {
              password_reset_token: TestUser1.password_reset_token,
              password: 'password2'
            }
          })
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.deep.equal({});
          })
          .end(done);
      });
    });
  });
  describe('/verify-email', () => {
    before(() => {
      return loadFixtures('users');
    });
    after(() => {
      return unloadFixtures('all_users');
    });
    describe('when an invalid token is provided', () => {
      it('responds with an error', (done) => {
        request
          .post('/api/users/verify-email')
          .send({
            payload: {
              email_verification_token: '12345'
            }
          })
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.false;
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('name');
            expect(res.body.error.name).to.equal('ParametersInvalidError');
          })
          .end(done);
      });
    });
    describe('when a valid token is provided', () => {
      it('responds with success', (done) => {
        request
          .post('/api/users/verify-email')
          .send({
            payload: {
              email_verification_token: TestUser1.email_verification_token
            }
          })
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.have.property('email');
          })
          .end(done);
      });
    });
  });
});