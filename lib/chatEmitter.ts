import { EventEmitter } from 'events';

// global emitter for chat messages
export const chatEmitter: EventEmitter = (global as any).chatEmitter || new EventEmitter();

if (!(global as any).chatEmitter) {
  (global as any).chatEmitter = chatEmitter;
}
