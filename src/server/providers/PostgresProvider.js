import Promise from 'bluebird';
import BaseProvider, {BaseProviderClient} from './BaseProvider';
import pg from 'pg';
import named from 'node-postgres-named';

class PostgresProvider extends BaseProvider {
  connect() {
    this.pgPool = new pg.Pool({
      host: this.config.POSTGRES_HOST,
      user: this.config.POSTGRES_USER,
      password: this.config.POSTGRES_PASSWORD,
      database: this.config.POSTGRES_DB,
      max: 10,
      Promise: Promise,
    });
    return Promise.resolve(null);
  }

  disconnect() {
    return this.pgPool.end()
      .then(() => {
        this.pgPool = null;
        return null;
      });
  }

  acquireClient() {
    return this.pgPool.connect()
      .then((client) => {
        return new PostgresProviderClient(client);
      });
  }
}

class PostgresProviderClient extends BaseProviderClient {
  constructor(client) {
    super();
    named.patch(client);
    this.client = client;
  }

  close() {
    this.client.release();
    return Promise.resolve(null);
  }

  query(...args) {
    let q = args.shift();
    let params = args.shift();
    return new Promise((resolve, reject) => {
      console.log('Postgres [query]: ', q);
      this.client.query(q, params, (error, result) => {
        if(error) {return reject(error);}
        return resolve(result.rows);
      });
    });
  }

  transaction() {
    return this.query('BEGIN');
  }

  rollback() {
    return this.query('ROLLBACK');
  }

  commit() {
    return this.query('COMMIT');
  }
}

export default PostgresProvider
