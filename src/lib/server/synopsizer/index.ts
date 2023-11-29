import { env } from '$env/dynamic/private';
import type { Synopsizer } from './synopsizer';
import { OpenAISynopsizer, type OpenAISynopsizerOptions } from './openai';
import { TextTruncatingSynopsizer, type TextTruncatingSynopsizerOptions } from './textTrunc';

export type { Synopsizer } from './synopsizer';

export function init(): Synopsizer {
  switch (env.SYNOPSIZER ?? TextTruncatingSynopsizer.name) {
    case OpenAISynopsizer.name: 
      return OpenAISynopsizer.init();
    case TextTruncatingSynopsizer.name:
      return TextTruncatingSynopsizer.init();
    default:
      throw `Unknown synopsizer: ${env.SYNOPSIZER}`;
  }
}
