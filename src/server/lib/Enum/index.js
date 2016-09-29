/*
 * Based on https://gist.github.com/xmlking/e86e4f15ec32b12c4689
 */

export class EnumSymbol {
  constructor(name: string, {value, description}) {
    this.sym = Symbol.for(name);
    if(!Object.is(value, undefined)) this.value  = value;
    if(description) this.description  = description;

    Object.freeze(this);
  }

  get display() {
    return this.description || Symbol.keyFor(this.sym);
  }

  toString() {
    return this.sym;
  }

  valueOf() {
    return this.value;
  }
}

class Enum {
  constructor(enumLiterals) {
    this._values = {};
    for (let key in enumLiterals) {
      if(!enumLiterals[key]) throw new TypeError('each enum should have been initialized with atleast empty {} value');
      this[key] =  new EnumSymbol(key, enumLiterals[key]);
      let value = this[key].valueOf();
      if(value) {
        this._values[value] = key;
      }
    }
    Object.freeze(this);
  }

  symbols() {
    let symbols = [];
    for(key of Object.keys(this)) {
      symbols.push(this[key]);
    }
    return symbols;
  }

  keys() {
    return Object.keys(this);
  }

  contains(sym) {
    if (!(sym instanceof EnumSymbol)) return false;
    return this[Symbol.keyFor(sym.sym)] === sym;
  }

  fromValue(value) {
    let key;
    if(value && typeof value === 'object' && value.hasOwnProperty('value')) {
      key = this._values[value.value];
    } else {
      key = this._values[value];
    }
    return this[key];
  }
}

export default Enum
