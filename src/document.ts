// =============================================================================
// Zenodotus
//
// Document Model
//
// TODO: Add description
// =============================================================================

import _ from "lodash";

import { generateId } from "utils";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

namespace Document {
  type Primitive = boolean | null | number | string | Date;
  type List = Primitive[];
  type Collection = {
    [key: string]: Primitive | List | Collection;
  };

  export type Value = Primitive | List | Collection;

  export interface Constructor {
    [key: string]: Value;
    createdAt: Date;
    id?: string;
    updatedAt?: Date;
  }
}

// -----------------------------------------------------------------------------
// Document Model
// -----------------------------------------------------------------------------

export class Document {
  static check(key: number | string, value: Document.Value) {
    key = _.isNumber(key) ? _.toString(key) : key;

    if (
      (key[0] === '$') &&
      !(key === '$$date' && typeof value === 'number') &&
      !(key === '$$deleted' && value === true) &&
      !(key === '$$indexCreated') &&
      !(key === '$$indexRemoved')
    ) {
      throw new Error('Field names cannot begin with the $ character');
    }

    if (key.indexOf('.') !== -1) {
      throw new Error('Field names cannot contain a .');
    }
  }

  static serialize(document: Document) {
    return JSON.stringify(document, (key, value: Document.Value) => {
      Document.check(key, value);

      if (_.isUndefined(value)) return undefined;
      if (_.isNull(value)) return null;
      if (_.isDate(value)) return { $$date: value };

      return value;
    })
  }

  static deserialize(data: string) {
    return JSON.parse(data, (key, value) => {
      if (key === '$$date') return new Date(value);
      if (
        _.isBoolean(value) ||
        _.isNull(value) ||
        _.isNumber(value) ||
        _.isString(value)
      ) return value;
      if (value && value.$$date) return value.$$date;

      return value;
    })
  }

  createdAt: Date;
  id?: string;
  updatedAt?: Date;

  [key: string]: Document.Value;

  constructor(data: Document.Constructor) {
    let { id, createdAt, updatedAt, ...documentData } = data;
    let timestamp = new Date();

    this.createdAt = createdAt ? (_.isDate(createdAt) ? createdAt : new Date(createdAt)) : timestamp;
    this.id = id || generateId();
    this.updatedAt = updatedAt ? (_.isDate(updatedAt) ? updatedAt : new Date(updatedAt)) : timestamp;

    _.map(documentData, (value, key) => this[key] = value);
  }
}
