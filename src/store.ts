// =============================================================================
// Zenodotus
//
// Store
// TODO: Add description
// =============================================================================

import _ from "lodash";

// TODO: Check Bluebird for performance and compatibility
// import Promise from "bluebird";

import { Document } from "document";
import { Executor } from "executor";
import { Persistence } from "persistence";
import { generateId } from "utils";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

namespace Store {
  export interface Constructor {
    afterSerialization?: () => void;
    autoload?: boolean;
    beforeDeserialization?: () => void;
    corruptAlertThreshold?: number;
    filename?: string;
    onLoad?: () => void;
    timestamp?: boolean;
  }

  export interface EnsureIndex {
    callback?: () => void;
    expireAfterSeconds?: number;
    fieldName: string;
    sparse: boolean;
    unique: boolean;
  }
}

// -----------------------------------------------------------------------------
// Store
// -----------------------------------------------------------------------------

export class Store {
  autoload: boolean;
  executor: Executor;
  filename: string;
  indexes: any; // Index;
  persistence: Persistence;
  timestamp: boolean;

  constructor(options: Store.Constructor) {
    let {
      autoload = false,
      filename = null,
      timestamp = false,
    } = options;

    this.autoload = autoload;
    this.timestamp = timestamp;

    if (!filename || typeof filename !== 'string' || filename.length === 0) {

    }

    this.executor = new Executor();

    this.indexes = {
      id: {} // new Index({ fieldName: 'id', unique: true });
    }

    this.persistence = new Persistence({
      store: this,
      afterSerialization: options.afterSerialization,
      beforeDeserialization: options.beforeDeserialization,
      corruptAlertThreshold: options.corruptAlertThreshold,
    });

    if (this.autoload) {
      this.loadDatabase();
    }
  }

  addToIndexes(document: any) {
    let error: any;
    let failingIndex: number;
    let keys = _.keys(this.indexes);

    for (let i = 0, l = keys.length; i < l; i++) {
      try {
        this.indexes[keys[i]].insert(document);
      } catch (e) {
        error = e;
        failingIndex = i;
        break;
      }
    }

    // If an error happened, we need to rollback the insert on all other indexes
    if (error) {
      for (let i = 0; i < failingIndex; i++) {
        this.indexes[keys[i]].remove(document);
      }
    }
  }

  loadDatabase() {
    this.executor.push({
      this: this.persistence,
      fn: this.persistence.loadDatabase,
      arguments,
    }, true);
  }

  getAllData() {
    return this.indexes.id.getAll();
  }

  // insert(...args) {
  //   this.executor.push({
  //     store: this,
  //     execute: this._insert,
  //     args,
  //   });
  // }

  async insert(document) {

  }

  removeFromIndexes(document: any) {
    _.forEach(this.indexes, (value, key) => {
      this.indexes[key].remove(document);
    })
  }

  removeIndex(fieldName: string, callback = (error?: any) => {}) {
    delete this.indexes[fieldName];

    this.persistence.persistNewState([{ $$indexRemoved: fieldName }], (error) => {
      if (error) return callback(error);

      return callback(null)
    })
  }

  resetIndexes(newData: any) {
    _.forEach(this.indexes, (value, key) => {
      this.indexes[key].reset(newData);
    })
  }

  private generateId() {
    let id = generateId();

    if (this.indexes.id.getMatching(id).length > 0) {
      id = generateId();
    }

    return id;
  }

  private prepareForInsertion(data) {
    if (_.isArray(data)) {
      let documents = [];

      for (let document of data) {
        documents.push(this.prepareForInsertion(document));
      }

      return documents;
    }

    let document = _.clone(data);

    if (_.isNil(document.id)) {
      document.id = this.generateId();
    }

    if (this.timestamp && _.isNil(document.createdAt) || _.isNil(document.updatedAt)) {
      let timestamp = new Date();

    }
  }

}
