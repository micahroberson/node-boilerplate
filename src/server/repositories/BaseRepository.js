import Promise from 'bluebird';
import _ from 'lodash';
import {NotFoundError} from '../lib/errors/APIError';

class BaseRepository {
  static tableName = null;
  static modelClass = null;

  constructor(ctx) {
    this.db = ctx.providerClients.postgresProviderClient;
    this.queue = ctx.providerClients.bullQueueProviderClient;
    this.mailer = ctx.providerClients.mailerProviderClient;
  }

  find(...args) {
    let columnValueMap = args.shift() || {};
    let options = _.defaults(args.pop() || {}, {firstOnly: false, errorOnNotFound: false});

    let conditions = _.map(columnValueMap, (val, key) => {
      return `${key} = $${key}`;
    });
    let conditionsStr = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ``;

    if(options.firstOnly) {
      conditionsStr += ` LIMIT 1`;
    }

    return this.db.query(`SELECT * FROM ${this.constructor.tableName} ${conditionsStr}`, columnValueMap)
      .then((records) => {
        if(options.firstOnly) {
          if(!records.length) {
            if(options.errorOnNotFound) {
              return Promise.reject(new NotFoundError());
            }
            return null;
          }
          return new this.constructor.modelClass(records[0]);
        }
        return records.map((r) => {
          return new this.constructor.modelClass(r);
        });
      });
  }

  findById(id, options={}) {
    return this.find({id}, _.defaults({firstOnly: true}, options));
  }

  findbyIds(ids) {
    return this.db.query(`SELECT * FROM ${this.constructor.tableName} WHERE id=ANY($ids)`, {ids})
      .then((records) => {
        return records.map((r) => {
          return new this.constructor.modelClass(r);
        });
      });
  }

  create(model) {
    let params = this[`_serialize${this.constructor.modelClass.name}ForSql`](model);
    if(params.hasOwnProperty('id') && !params.id) {
      delete params.id;
    }
    let columns = _.keys(params);
    return this.db.query(`
      INSERT INTO ${this.constructor.tableName} (${columns.join(', ')})
      VALUES (${columns.map(c => `$${c}`).join(', ')}) RETURNING *
    `, params)
      .then((records) => {
        return model.assignRelationReferences(new this.constructor.modelClass(records[0]));
      });
  }

  stringifyParamsForUpdate(params) {
    return _.map(params, (val, key) => {
      return `${key} = $${key}`;
    }).join(', ');
  }
}

export default BaseRepository;