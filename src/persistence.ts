// =============================================================================
// Zenodotus
//
// Persistence
// TODO: Add description
// =============================================================================

import Promise from "bluebird";
import _ from "lodash";
import fs from "fs-extra";
import path from "path";

import * as Storage from "./storage";
import { Document } from "./document";
import { Store } from "./store";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

namespace Persistence {
  export interface Constructor {
    filename: string;
    store: Store;
  }
}

// -----------------------------------------------------------------------------
// Persistence
// -----------------------------------------------------------------------------

export class Persistence {
  filename: string;
  store: Store;

  constructor(options) {
    this.filename = options.store.filename;
    this.store = options.store;
  }

  ensureDirectoryExists(directory, callback = (error) => {}) {
    fs.ensureDir(directory, (error) => callback(error));
  }

  // async persistNewState(documents: Document[]) {
  //   let data = '';

  //   for (let document of documents) {
  //     data += Document.serialize(document) + '\n';
  //   }

  //   // try {
  //   //   return fs.appendFile(this.filename, data, 'utf-8');
  //   // } catch (error) {
  //   //   throw new Error(error);
  //   // }

  //   return new Promise((resolve, reject) => {
  //     fs.appendFile(this.filename, data, (error) => {
  //       if (error) reject(error);
  //       else resolve();
  //     })
  //   })
  // }
}
