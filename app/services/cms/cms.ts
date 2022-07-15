import { GitHub } from './sources';
import { Logger } from '../logger';
import type { Source } from './domain';

class CMS implements Source {
  #logger;

  #src;

  constructor(src: Source) {
    this.#logger = new Logger('CMS');
    this.#src = src;
  }

  async getPosts(): Promise<Array<unknown>> {
    this.#logger.debug('Retrieving posts');
    return this.#src.getPosts();
  }

  async getPost(id: string): Promise<unknown> {
    this.#logger.debug(`Retrieving post with [id=${id}]`);
    return this.#src.getPost(id);
  }
}

export const instance = new CMS(GitHub);
