import Promise from 'bluebird';
import {shouldRequireAuthentication} from '../setup';

const TestUser1Id = '57f5ce62f7ef15329037230b';
const TestUser2Id = '57f5ce765af73e32901fac27';
const TestUser1AuthHeader = ['Authorization', `Bearer ${new Buffer('57f7d29bd0103432905d0160').toString('base64')}`];
const TestUser2AuthHeader = ['Authorization', `Bearer ${new Buffer('57f7d2d3a6a9583290301321').toString('base64')}`];

const TestStripeTokenId = 'tok_191SDiGVsaoEU4AENfvdf01l';

describe('/teams', () => {
  describe('/create', () => {
    shouldRequireAuthentication('/api/teams/create');
    before(() => {
      return loadFixtures('users', 'user_sessions');
    });
    after(() => {
      return unloadFixtures('all_teams', 'user_sessions', 'all_users');
    });
    describe('when a valid payload is provided', () => {
      it('responds with a team', (done) => {
        request
          .post('/api/teams/create')
          .set(...TestUser1AuthHeader)
          .send({payload: {}})
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.have.property('team');
            expect(res.body.payload.team.primary_user_id).to.equal(TestUser1Id);
          })
          .end(done);
      })
    });
    describe('when an invalid payload is provided', () => {
      describe('when the current user already belongs to a team', () => {
        it('responds with an error', (done) => {
          request
            .post('/api/teams/create')
            .set(...TestUser2AuthHeader)
            .send({payload: {}})
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
  });
  describe('/team', () => {
    shouldRequireAuthentication('/api/teams/team');
    before(() => {
      return loadFixtures('users', 'user_sessions', 'teams');
    });
    after(() => {
      return unloadFixtures('all_teams', 'user_sessions', 'all_users');
    });
    describe('when a valid payload is provided', () => {
      it('responds with a team', (done) => {
        request
          .post('/api/teams/team')
          .set(...TestUser2AuthHeader)
          .send({payload: {}})
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.have.property('team');
            expect(res.body.payload.team.primary_user_id).to.equal(TestUser2Id);
          })
          .end(done);
      })
    });
    describe('when an invalid payload is provided', () => {
      describe('when the current user does not belong to a team', () => {
        it('responds with a null team', (done) => {
          request
            .post('/api/teams/team')
            .set(...TestUser1AuthHeader)
            .send({payload: {}})
            .expect((res) => {
              expect(res.body).to.have.property('success');
              expect(res.body.success).to.be.true;
              expect(res.body).to.have.property('payload');
              expect(res.body.payload).to.have.property('team');
              expect(res.body.payload.team).to.equal(null);
            })
            .end(done);
        });
      });
    });
  });
  describe('/add-payment-method', () => {
    shouldRequireAuthentication('/api/teams/add-payment-method');
    before(() => {
      return loadFixtures('users', 'user_sessions', 'teams');
    });
    after(() => {
      return unloadFixtures('all_payment_methods', 'all_teams', 'user_sessions', 'all_users');
    });
    describe('when a valid payload is provided', () => {
      it('responds with a team and newly added payment_method', (done) => {
        request
          .post('/api/teams/add-payment-method')
          .set(...TestUser2AuthHeader)
          .send({payload: {
            stripe_token_id: TestStripeTokenId
          }})
          .expect((res) => {
            expect(res.body).to.have.property('success');
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('payload');
            expect(res.body.payload).to.have.property('team');
            expect(res.body.payload.team.payment_methods.length).to.equal(1);
          })
          .end(done);
      })
    });
    describe('when an invalid payload is provided', () => {
      describe('when the current user does not belong to a team', () => {
        it('responds with a null team', (done) => {
          request
            .post('/api/teams/add-payment-method')
            .set(...TestUser1AuthHeader)
            .send({payload: {}})
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
  });
});
