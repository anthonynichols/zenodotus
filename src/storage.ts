// =============================================================================
// Zenodotus
//
// Storage
// TODO: Add description
// =============================================================================

import Promise from "bluebird";
import _ from "lodash";
import fs from "fs-extra";

interface FlushOptions {
  filename: string;
  isDir?: boolean;
}

export function flush(options: string | FlushOptions) {
  let filename: string;
  let flags: string;

  if (_.isString(options)) {
    filename = options;
    flags = 'r+';
  } else {
    filename = options.filename;
    flags = options.isDir ? 'r' : 'r+';
  }

  return new Promise<void>(async (resolve, reject) => {
    let fd: number;

    if ((flags === 'r') && (process.platform === 'win32')) resolve();

    try {
      fd = await fs.open(filename, flags);
      await fs.fsync(fd);
      await fs.close(fd);
    } catch (error) {
      reject(error);
    }

    resolve();
  })
}

export function writeFile(filename, data) {
  let tmp = `${filename}~`;

  return new Promise<void>(async (resolve, reject) => {
    try {
      await fs.ensureFile(filename);
      await flush({ filename });

      await fs.writeFile(tmp, data);
      await flush({ filename: tmp });

      await fs.rename(tmp, filename);
      await flush(filename);
    } catch(error) {
      reject(error);
    }

    resolve();
  })
}

export function ensureFileIntegrity(filename) {
  let tmp = `${filename}~`;

  return new Promise<void>(async (resolve, reject) => {
    try {
      await fs.ensureFile(filename).then(resolve);
      await fs.ensureFile(tmp).then(resolve);
      await fs.rename(tmp, filename);
    } catch (error) {
      reject(error);
    }

    resolve();
  })
}
