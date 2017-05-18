// =============================================================================
// Zenodotus
//
// Executor
// TODO: Add description
// =============================================================================

import { queue } from "async";

import { Store } from "./store";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

namespace Executor {
  export interface Task {
    args: any[];
    execute: () => any;
    store: Store;
  }
}

// -----------------------------------------------------------------------------
// Executor
// -----------------------------------------------------------------------------

export class Executor {

  buffer: Executor.Task[] = [];

  forcePush(task: Executor.Task) {
    this.queue.push(task);
  }

  ready = false;

  processBuffer() {
    this.ready = true;

    for (let task of this.buffer) {
      this.queue.push(task);
    }

    this.buffer = [];
  }

  push(task) {
    if (this.ready) {
      this.queue.push(task);
    } else {
      this.buffer.push(task);
    }
  }

  queue = queue((task: Executor.Task, callback) => {
    let newArguments = [];
    let lastArgument = task.arguments[task.arguments.length - 1];

    for (let argument of task.arguments) {
      newArguments.push(argument);
    }

    task.fn.apply(task.this, newArguments);
  }, 1);
}
