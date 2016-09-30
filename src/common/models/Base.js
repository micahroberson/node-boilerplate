class Base {
  static embeds() {return {};}
  static belongsTo() {return {};}
  static hasOne() {return {};}
  static hasMany() {return {};}

  constructor(values) {
    values = values || {};

    this.id = values.id;
    this.created_at = values.created_at;
    this.updated_at = values.updated_at;
    this.deleted_at = values.deleted_at;

    let belongsToRelations = this.constructor.belongsTo();
    let embedsRelations = this.constructor.embeds();
    let hasOneRelations = this.constructor.hasOne();
    let hasManyRelations = this.constructor.hasMany();

    // Set foreign keys
    for(let relationName in belongsToRelations) {
      let relation = belongsToRelations[relationName];
      relation.foreign_key = relation.foreign_key || `${relationName}_id`;
      this[relation.foreign_key] = values[relation.foreign_key] || null;
    }

    for(let key in values) {
      let val = values[key];
      if(!val) {continue;}

      let relation;
      if (relation = embedsRelations[key]) {
        if (!(val instanceof relation.class)) {
          val = relation.factory ? relation.factory.create(val) : new relation.class(val);
        }
        this[`${key}`] = val;
      }
      else if (relation = hasManyRelations[key]) {
        this[`${key}`] = val.map(v => {
          if (!(v instanceof relation.class)) {
            v = relation.factory ? relation.factory.create(v) : new relation.class(v);
          }
          return v;
        });
      }
      else if (relation = belongsToRelations[key]) {
        if (!(val instanceof relation.class)) {
          val = relation.factory ? relation.factory.create(val) : new relation.class(val);
        }
        this[`${key}`] = val;
      } else if (relation = hasOneRelations[key]) {
        if (!(val instanceof relation.class)) {
          val = relation.factory ? relation.factory.create(val) : new relation.class(val);
        }
        this[`${key}`] = val;
      }
    }
  }

  assignRelationReferences(copy) {
    let relations = Object.assign(
      {},
      this.constructor.belongsTo(),
      this.constructor.hasMany(),
      this.constructor.hasOne()
    );

    for(let relationName in relations) {
      copy[relationName] = this[relationName];
    }
    return copy;
  }
}

export default Base;