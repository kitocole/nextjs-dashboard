import { EventEmitter } from 'events';

declare global {
  // Augment the global object so we can store a single EventEmitter instance
  // across modules without using `any`.
  // eslint-disable-next-line no-var
  var chatEmitter: EventEmitter | undefined;
}

// Use the existing emitter if it was previously attached to `globalThis`
// to ensure a single shared instance.
export const chatEmitter: EventEmitter = globalThis.chatEmitter ?? new EventEmitter();

if (!globalThis.chatEmitter) {
  globalThis.chatEmitter = chatEmitter;
}
