// =============================================================================
// Zenodotus
//
// Utilities
// TODO: Add description
// =============================================================================

// -----------------------------------------------------------------------------
// Generate ID
// -----------------------------------------------------------------------------

let ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let ALPHABET_LENGTH = ALPHABET.length;
let ID_LENGTH = 16;

/**
 * Generates an ID
 *
 * @export
 * @param {any} [idLength=ID_LENGTH]
 * @returns
 */
export function generateId(idLength = ID_LENGTH) {
  let id = '';

  for (let i = 0; i < idLength; i++) {
    id += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET_LENGTH));
  }

  return id;
}
