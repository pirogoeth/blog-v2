import type { RedisClientType, SetOptions } from 'redis';
import { createClient } from 'redis';
import { Logger, type ILogObj } from 'tslog';

const log = new Logger<ILogObj>();

export interface Options {
  url: string,
};

export class RedisCache {
  client: RedisClientType

  constructor(opts: Options) {
    this.client = createClient({ url: opts.url ?? 'redis://localhost:6379' });
    this.client.on('error', err => this.handleError(err)).connect();
  }

  handleError(err: Error) {
    log.error(`Redis client encountered an error: ${err}`);
  }

  async keyGet(key: string): Promise<string|null> {
    log.silly(`Cache GET ${key}`);
    return await this.client.get(key);
  }

  async keySet(key: string, value: string, options?: SetOptions) {
    log.silly(`Cache SET ${key} with ${options} => ${value.slice(0, 30)}...`);
    return await this.client.set(key, value, options);
  }

  async setAdd(key: string, values: string[]): Promise<number> {
    log.silly(`Cache SADD ${key} => ${values}`);
    return await this.client.sAdd(key, values);
  }

  async setGetAll(key: string): Promise<string[]> {
    log.silly(`Cache SMEMBERS ${key}`);
    return await this.client.sMembers(key);
  }
};