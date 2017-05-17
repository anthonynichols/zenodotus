// =============================================================================
// Zenodotus
//
// TODO: Add description
// =============================================================================

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

namespace Store {
  export interface Constructor {
    afterSerialization?: () => void;
    autoload?: boolean;
    beforeDeserialization?: () => void;
    filename?: string;
    onLoad?: () => void;
    timestamp?: boolean;
  }
}

// -----------------------------------------------------------------------------
// Store
// -----------------------------------------------------------------------------

export class Store {
  filename: string;

  constructor(options: Store.Constructor) {
    let {
      autoload = false,
      filename = null,
      timestamp = false,
    } = options;

    if (!filename || typeof filename !== 'string' || filename.length === 0) {

    }
  }
}
