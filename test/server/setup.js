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
        global.authenticateUser = (email) => {
          if(!email || (Array.isArray(email) && !email.length)) {
            email = 'test@example.com';
          }
          return new Promise((resolve, reject) => {
            global.request
              .post('/api/users/sign-in')
              .send({
                payload: {
                  email,
                  password: 'password'
                }
              })
              .end((error, res) => {
                if(error) {return reject(error);}
                let sessionToken = res.body.payload.session_token;
                let userId = res.body.payload.user.id;
                let authHeader = ['Authorization', `Bearer ${new Buffer(sessionToken).toString('base64')}`];
                resolve({
                  authHeader,
                  sessionToken,
                  userId
                });
              });
          });
        };
        global.loadFixtures = (...tables) => {
          return ctx.providerClients.postgresProviderClient.transaction()
            .then(() => {
              return ctx.providerClients.postgresProviderClient.query(`SET CONSTRAINTS ALL DEFERRED`);
            })
            .then(() => {
              return Promise.all(tables.map((table) => {
                let json = require(`../fixtures/${table}.json`);
                let columns = Object.keys(json[0]);
                let params = {};
                let values = json.map((rowObject, i) => {
                  return columns.map((key) => {
                    let val = rowObject[key];
                    if(val === 'CURRENT_TIMESTAMP') {
                      val = new Date();
                    }
                    let fieldWithSuffix = `${key}${i}`;
                    params[fieldWithSuffix] = val;
                    return `$${fieldWithSuffix}`;
                  }).join(', ');
                });
                return ctx.providerClients.postgresProviderClient.query(`
                  INSERT INTO ${table}
                  (${columns.join(', ')})
                  VALUES ${values.map(v => `(${v})`).join(', ')}
                `, params);
              }));
            })
            .then(() => {
              return ctx.providerClients.postgresProviderClient.commit();
            })
            .catch((error) => {
              return ctx.providerClients.postgresProviderClient.rollback()
                .then(() => {
                  throw error;
                });
            });
        };
        global.unloadFixtures = (...tables) => {
          return ctx.providerClients.postgresProviderClient.transaction()
            .then(() => {
              return Promise.all(tables.map((table) => {
                return ctx.providerClients.postgresProviderClient.query(`
                  DELETE FROM ${table}
                `);
              }));
            })
            .then(() => {
              return ctx.providerClients.postgresProviderClient.commit();
            })
            .catch((error) => {
              return ctx.providerClients.postgresProviderClient.rollback()
                .then(() => {
                  throw error;
                });
            });
        };
        done();
      });

      // environment.createRequestContext().then((ctx) => {
      //   global.loadFixtures = (...args) => {
      //     let cb = args.pop();
      //     let models = [...args];
      //     let recursivelyCreateModels = (models, cb) => {
      //       if(!(models && models.length)) {return cb();}
      //       let model = models[0];
      //       let entities = require(`../fixtures/${model}s.json`);
      //       let modelClass = require(`../../src/common/models/${toTitleCase(model)}`).default;
      //       let recursivelyCreateEntities = (entities, cb) => {
      //         if(!(entities && entities.length)) {return cb();}
      //         let data = entities[0];
      //         _.each(data, (val, key) => {
      //           if(val === 'CURRENT_TIMESTAMP') {
      //             data[key] = new Date();
      //           }
      //         });
      //         let entity = new modelClass(data);
      //         ctx[`${model}sRepository`]
      //           .create(entity)
      //           .then(() => {
      //             return recursivelyCreateEntities(entities.shift(), cb);
      //           })
      //           .catch((error) => {
      //             return cb(error);
      //           });
      //       };
      //       recursivelyCreateEntities(entities, cb);
      //     };
      //     recursivelyCreateModels(models, cb);
      //   };
      //   global.unloadFixtures = (...args) => {
      //     let cb = args.pop();
      //     let models = [...args];

      //   };
      //   done();
      // });
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