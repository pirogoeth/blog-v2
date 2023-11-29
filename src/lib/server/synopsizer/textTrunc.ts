import type { RedisCache } from '../cache';
import { Logger, type ILogObj } from 'tslog';
import { Synopsizer } from './synopsizer';

const log = new Logger<ILogObj>();

export interface TextTruncatingSynopsizerOptions {
  cache?: RedisCache,
};

export class TextTruncatingSynopsizer extends Synopsizer {
  static name: string = 'textTruncator';

  static init(): Synopsizer {
    return new this();
  }

  async generateSynopsis(postText: string): Promise<string> {
    return Promise.resolve("this synopsizer is not currently implemented");
  }
}