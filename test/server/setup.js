import _ from 'lodash';
import express from 'express';
import request from 'supertest';
import chai from 'chai';
import ApiRouter from '../../src/server/routers/api';
import Environment from '../../src/server/config/Environment';
import providers from './mocks/providers';

// Setup env
before((done) => {
  let server = express();
  let environment = new Environment();
  environment.load(providers)
    .then(() => {
      let apiRouter = new ApiRouter(environment);
      server.use('/api', apiRouter.routes);

      global.request = request(server);
      global.should = chai.should();
      global.expect = chai.expect;

      environment.createRequestContext().then((ctx) => {
        global.loadFixtures = (model, cb) => {
          let entities = require(`../fixtures/${model}s.json`);
          let modelClass = require(`../../src/common/models/${toTitleCase(model)}`).default;
          let recursivelyCreateEntities = (entities, cb) => {
            if(!(entities && entities.length)) {return cb();}
            let data = entities[0];
            _.each(data, (val, key) => {
              if(val === 'CURRENT_TIMESTAMP') {
                data[key] = new Date();
              }
            });
            let entity = new modelClass(data);
            ctx[`${model}sRepository`]
              .create(entity)
              .then(() => {
                return recursivelyCreateEntities(entities.shift(), cb);
              })
              .catch((error) => {
                return cb(error);
              });
          };
          recursivelyCreateEntities(entities, cb);
        };
        done();
      });
    });
});

export let shouldRequireAuthentication = (path) => {
  describe('when no Authorization header is present', () => {
    it('returns an UnauthorizedAccessError', (done) => {
      global.request
        .post(path)
        .send({})
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.false;
          expect(res.body).to.have.property('error');
          expect(res.body.error.name).to.equal('UnauthorizedAccessError');
        })
        .end(done);
    });
  });
  describe('when an invalid token is provided', () => {
    it('returns an UnauthorizedAccessError', (done) => {
      global.request
        .post(path)
        .send({})
        .set('Authorization', 'Bearer aaaaaaaaaaaaaaaaaaaa')
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.false;
          expect(res.body).to.have.property('error');
          expect(res.body.error.name).to.equal('UnauthorizedAccessError');
        })
        .end(done);
    });
  });
};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}