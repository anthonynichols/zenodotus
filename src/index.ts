// =============================================================================
// Zenodotus
//
// Index
// TODO: Add description
// =============================================================================

import _ from "lodash";
import { AVLTree } from "binary-search-tree";

import { Document } from "./document";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

namespace Index {
  export interface Constructor {
    fieldName: string;
    unique?: boolean;
    sparse?: boolean;
  }

  export interface TreeOptions {
    unique?: boolean;
    compareKeys
  }
}

// -----------------------------------------------------------------------------
// Index
// -----------------------------------------------------------------------------

export class Index {
  fieldName: string;
  unique?: boolean;
  sparse?: boolean;

  constructor(options: Index.Constructor) {
    this.fieldName = options.fieldName;
    this.unique = options.unique || false;
    this.sparse = options.sparse || false;
  }
}
