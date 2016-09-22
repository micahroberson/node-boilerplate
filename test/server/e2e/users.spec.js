import {shouldRequireAuthentication} from '../setup';

describe('/users', () => {
  describe('/', () => {
    before((done) => {
      loadFixtures('user', done);
    });
    describe('when an invalid payload', () => {
      describe('when the email is already taken', () => {
        it('responds with an error', (done) => {
          request
            .post('/api/users')
            .send({
              payload: {
                email: 'test@example.com',
                password: 'password'
              }
            })
            .expect(200)
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
            .post('/api/users')
            .send({
              payload: {
                email: 'test2@example.com',
                password: 'password'
              }
            })
            .expect(200)
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
          .post('/api/users')
          .send({
            payload: {
              name: 'Test User 2',
              email: 'test2@example.com',
              password: 'password'
            }
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.have.property('user');
            expect(res.body.payload.user).to.have.property('email');
            expect(res.body.payload.user.email).to.equal('test2@example.com');
            expect(res.body.payload).to.have.property('session_token');
          })
          .end(done);
      });
    });
  });
  describe('/sign-in', () => {
    before((done) => {
      loadFixtures('user', done);
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
          .expect(200)
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
    let sessionToken;
    shouldRequireAuthentication('/api/users/me');
    before((done) => {
      loadFixtures('user', () => {
        request
          .post('/api/users/sign-in')
          .send({
            payload: {
              email: 'test@example.com',
              password: 'password'
            }
          })
          .end((error, res) => {
            if(error) {return done(error);}
            sessionToken = res.body.payload.session_token;
            done();
          });
      });
    });
    describe('when a valid email & password are provided', () => {
      it('responds with a session_token and user', (done) => {
        request
          .post('/api/users/me')
          .set('Authorization', `Bearer ${new Buffer(sessionToken).toString('base64')}`)
          .expect(200)
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
    let sessionToken, userId;
    shouldRequireAuthentication('/api/users/update');
    before((done) => {
      loadFixtures('user', () => {
        request
          .post('/api/users/sign-in')
          .send({
            payload: {
              email: 'test@example.com',
              password: 'password'
            }
          })
          .end((error, res) => {
            if(error) {return done(error);}
            sessionToken = res.body.payload.session_token;
            userId = res.body.payload.user.id;
            done();
          });
      });
    });
    describe('when a valid email & password are provided', () => {
      it('responds with the updated user', (done) => {
        request
          .post('/api/users/update')
          .set('Authorization', `Bearer ${new Buffer(sessionToken).toString('base64')}`)
          .send({
            payload: {
              id: userId,
              name: 'New Name'
            }
          })
          .expect(200)
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
});