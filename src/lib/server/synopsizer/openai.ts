import OpenAI from 'openai';
import { env } from '$env/dynamic/private';
import type { RedisCache } from '../cache';
import { Logger, type ILogObj } from 'tslog';
import { Synopsizer } from './synopsizer';

const log = new Logger<ILogObj>();
const synopsizerPrompt = `You will be given a blog post in Markdown format.
Generate a less than 100 word synopsis of the post.
You should use a fun and engaging tone, and write in the first-person perspective, as if you are the blogger.`;

export interface OpenAISynopsizerOptions {
  apiKey: string,
  apiBaseUrl?: string,
  cache?: RedisCache,
};

export class OpenAISynopsizer extends Synopsizer {
  static name: string = 'openai'
  client: OpenAI

  static init(opts?: OpenAISynopsizerOptions): Synopsizer {
    if (env.OPENAI_TOKEN === null) {
      throw "OPENAI_TOKEN env must be set to use SYNOPSIZER=openai"
    }

    let nextOpts = Object.assign(
      {
        apiKey: env.OPENAI_TOKEN,
        apiBaseUrl: env.OPENAI_BASE_URL,
      },
      opts ?? {},
    );
    return new this(nextOpts);
  }

  constructor(opts: OpenAISynopsizerOptions) {
    super()

    this.client = new OpenAI({
      apiKey: opts.apiKey,
      baseURL: opts.apiBaseUrl,
    });
  }

  async generateSynopsis(postText: string): Promise<string> {
    const cachedSynopsis = await this.getCachedSynopsis(postText, [synopsizerPrompt]);
    if (cachedSynopsis !== null) {
      return Promise.resolve(cachedSynopsis) as Promise<string>;
    }

    const completions = await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: synopsizerPrompt },
        { role: 'user', content: postText },
      ],
      model: 'gpt-3.5-turbo',
    });
    log.silly(completions.choices[0].message);
    const completion = completions.choices.find(completion => {
      if (completion.message.content !== null) {
        return completion;
      }
    });

    const synopsis = completion?.message.content!;
    await this.cacheSynopsis(postText, synopsis, [synopsizerPrompt]);

    return synopsis;
  }
};
