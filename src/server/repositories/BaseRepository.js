import _ from 'lodash';
import Promise from 'bluebird';
import pg from 'pg';
import named from 'node-postgres-named';
import config from '../config';

let postgresPool = new pg.Pool({
  host: config.POSTGRES_HOST,
  user: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
  max: 10
});

class BaseRepository {
  db() {
    return postgresPool.connect().then((client) => {
      named.patch(client);
      client.pquery = (...args) => {
        let q = args.shift();
        let params = args.shift();
        return new Promise((resolve, reject) => {
          console.log('Postgres [query]: ', q);
          client.query(q, params, (error, result) => {
            if(error) {return reject(error);}
            return resolve(result.rows);
          });
        });
      }
      return client;
    })
    .catch((error) => {
      console.log('There was an error connecting to Postgres: ', error);
    });
  }

  stringifyParamsForUpdate(params) {
    return _.map(params, (val, key) => {
      return `${key} = $${key}`;
    }).join(', ');
  }
}

export default BaseRepository;