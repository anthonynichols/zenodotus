// =============================================================================
// Zenodotus
//
// Document
// TODO: Add description
// =============================================================================

import _ from "lodash";

import { generateId } from "./utils";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

namespace Document {
  export type Sortable = boolean | number | string;
  export type Primitive = boolean | null | number | string | Date;
  export type List = Primitive[];
  export type Collection = {
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
// Document
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

  static serialize(document: Document) {
    return JSON.stringify(document, (key, value: Document.Value) => {
      Document.check(key, value);

      if (_.isUndefined(value)) return undefined;
      if (_.isNull(value)) return null;
      if (_.isDate(value)) return { $$date: value };

      return value;
    })
  }

  static sort(a: any, b: any) {
    if (_.isUndefined(a)) return _.isUndefined(b) ? 0 : -1;
    if (_.isUndefined(b)) return _.isUndefined(a) ? 0 : 1;

    if (_.isNull(a)) return _.isNull(b) ? 0 : -1;
    if (_.isNull(b)) return _.isNull(a) ? 0 : 1;

    if (_.isNumber(a)) return _.isNumber(b) ? Document.sortPrimatives(a, b) : -1;
    if (_.isNumber(b)) return _.isNumber(a) ? Document.sortPrimatives(a, b) : 1;

    if (_.isString(a)) return _.isString(b) ? Document.sortPrimatives(a, b) : -1;
    if (_.isString(b)) return _.isString(a) ? Document.sortPrimatives(a, b) : 1;

    if (_.isBoolean(a)) return _.isBoolean(b) ? Document.sortPrimatives(a, b) : -1;
    if (_.isBoolean(b)) return _.isBoolean(a) ? Document.sortPrimatives(a, b) : 1;

    if (_.isDate(a)) return _.isDate(b) ? Document.sortPrimatives(a.getTime(), b.getTime()) : -1;
    if (_.isDate(b)) return _.isDate(a) ? Document.sortPrimatives(a.getTime(), b.getTime()) : 1;

    if (_.isArray<Document.Sortable>(a)) return _.isArray<Document.Sortable>(b) ? Document.sortArrays(a, b) : -1;
    if (_.isArray<Document.Sortable>(b)) return _.isArray<Document.Sortable>(a) ? Document.sortArrays(a, b) : 1;

    return Document.sortArrays(_.keys(a).sort(), _.keys(b).sort());
  }

  private static sortPrimatives(a: Document.Sortable, b: Document.Sortable) {
    if (a < b) return -1;
    if (a > b) return 1;

    return 0;
  }

  private static sortArrays(a: Document.Sortable[], b: Document.Sortable[]) {
    let result;

    for (let i = 0, length = Math.min(a.length, b.length); i < length; i++) {
      result = Document.sort(a[i], b[i]);

      if (result !== 0) return result;
    }

    return Document.sort(a.length, b.length);
  }

  static validate(document: Document) {
    if (_.isObject(document)) {
      let keys = _.keys(document);

      for (let key of keys) {
        Document.check(key, document[key]);
        Document.validate(document[key] as Document);
      }
    }
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
