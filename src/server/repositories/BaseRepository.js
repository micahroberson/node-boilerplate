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

  instantiateModel(records) {
    if(!(records && records.length)) {return null;}
    return new this.constructor.modelClass(records[0]);
  }

  instantiateModels(records) {
    return records.map((r) => {
      return new this.constructor.modelClass(r);
    });
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
      .then(this.instantiateModels);
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

  // Note: relation must be defined in the model in order to determine the foreign_key property
  assignTo(models) {
    let wasArray = true;
    if(!Array.isArray(models)) {
      models = [models];
      wasArray = false;
    }
    // Check first object for relation to current repo's modelClass
    let foreignKey, destinationProperty;
    let belongsToRelations = models[0].constructor.belongsTo();
    for(let relationName in belongsToRelations) {
      let relation = belongsToRelations[relationName];
      if(relation.class === this.constructor.modelClass) {
        foreignKey = relation.foreign_key || `${relationName}_id`;
        destinationProperty = relationName;
      }
    }
    let ids = models.map((model) => {return model[foreignKey];});
    return this.findbyIds(ids)
      .then((relatedModels) => {
        let relatedModelsByIdMap = relatedModels.reduce((map, relatedModel) => {
          map[relatedModel.id] = relatedModel;
          return map;
        }, {});
        models.forEach((model) => {
          model[destinationProperty] = relatedModelsByIdMap[model[foreignKey]];
        });
        if(!wasArray) {
          return models[0];
        }
        return models;
      });
  }

  assignManyTo(models) {
    let wasArray = true;
    if(!Array.isArray(models)) {
      models = [models];
      wasArray = false;
    }
    // Check first object for relation to current repo's modelClass
    let foreignKey, destinationProperty;
    let hasManyRelations = this.constructor.modelClass.belongsTo();
    for(let relationName in hasManyRelations) {
      let relation = hasManyRelations[relationName];
      if(relation.class === models[0].constructor) {
        foreignKey = relation.foreign_key || `${relationName}_id`;
        destinationProperty = relationName;
      }
    }
    let ids = models.map(m => m.id);
    return this.db.query(`SELECT * FROM ${this.constructor.tableName} WHERE ${foreignKey}=ANY($ids)`, {ids})
      .then(this.instantiateModels)
      .then((relatedModels) => {
        let relatedModelsByForeignKeyMap = _.groupBy(relatedModels, foreignKey);
        models.forEach((m) => {
          m[destinationProperty] = relatedModelsByForeignKeyMap[m.id] || [];
        });
        if(!wasArray) {
          return models[0];
        }
        return models;
      });
  }

  stringifyParamsForUpdate(params) {
    return _.map(params, (val, key) => {
      return `${key} = $${key}`;
    }).join(', ');
  }
}

export default BaseRepository;