import { RedisCache } from '../cache';
import { env } from '$env/dynamic/private';
import { Logger, type ILogObj } from 'tslog';
import { digestText } from '../utils'

const log = new Logger<ILogObj>();

export abstract class Synopsizer {
  cache: RedisCache

  constructor() {
    const synopsizerRedisUrl = env.SYNOPSIZER_REDIS_URL ?? 'redis://localhost:6379/1';
    this.cache = new RedisCache({ url: synopsizerRedisUrl });
  }

  abstract generateSynopsis(postText: string): Promise<string>

  protected keyPrefix(key: string): string {
    return `synopsizer:${key}`;
  }


  protected async getCachedSynopsis(postText: string, context?: string[]): Promise<string|null> {
    const digestedText = context === null ? digestText(postText) : digestText(postText+context!.join());
    log.debug(`Fetching cached synopsis for ${digestedText}`);
    return this.cache!.keyGet(this.keyPrefix(digestedText));
  }

  protected async cacheSynopsis(postText: string, synopsis: string, context?: string[]) {
    const digestedText = context === null ? digestText(postText) : digestText(postText+context!.join());
    return this.cache!.keySet(this.keyPrefix(digestedText), synopsis);
  }
}
