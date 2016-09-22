import express from 'express';
import request from 'supertest';
import chai from 'chai';
import ApiRouter from '../../src/server/routers/ApiRouter';
import RequestContext from '../../src/server/lib/RequestContext';

let server = express();
server.use('/api', ApiRouter);

let ctx = new RequestContext();

global.loadFixtures = (model, cb) => {
  let entities = require(`../fixtures/${model}s.json`);
  let modelClass = require(`../../src/common/models/${toTitleCase(model)}`).default;
  let recursivelyCreateEntities = (entities, cb) => {
    if(!(entities && entities.length)) {return cb();}
    let entity = new modelClass(entities[0]);
    ctx[`${model}sRepository`]
      .create(entity)
      .then(() => {
        return recursivelyCreateEntities(entities.shift(), cb);
      })
      .catch((error) => {
        return cb(error);
      });
  };
  recursivelyCreateEntities(entities, (error) => {
    return cb();
  });
};

global.request = request(server);
global.should = chai.should();
global.expect = chai.expect;

export let shouldRequireAuthentication = (path) => {
  describe('when no Authorization header is present', () => {
    it('returns an UnauthorizedError', (done) => {
      global.request
        .post(path)
        .send({})
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.false;
          expect(res.body).to.have.property('error');
          expect(res.body.error.name).to.equal('UnauthorizedError');
        })
        .end(done);
    });
  });
  describe('when an invalid token is provided', () => {
    it('returns an UnauthorizedError', (done) => {
      global.request
        .post(path)
        .send({})
        .set('Authorization', 'Bearer aaaaaaaaaaaaaaaaaaaa')
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.false;
          expect(res.body).to.have.property('error');
          expect(res.body.error.name).to.equal('UnauthorizedError');
        })
        .end(done);
    });
  });
};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}