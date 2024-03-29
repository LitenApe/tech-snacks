import { RawContent, Source } from '../../domain';
import { readContentDirectory, readFileContent } from './file_reader_utils';

import type { Logger } from '~/services/logger';
import { getLogger } from '~/services/logger';

export class Local implements Source {
  #logger: Logger;

  #content_location: string;

  constructor() {
    this.#logger = getLogger('CMS:Local');

    const contentDirLocation = process.env.CONTENT_LOCATION;

    if (typeof contentDirLocation === 'undefined') {
      throw new Error(
        'Undefined content location! Make sure that environment variables are loaded into the system correctly',
      );
    }

    this.#content_location = contentDirLocation;
  }

  async getPost(id: string): Promise<RawContent> {
    try {
      const content = await readFileContent(this.#content_location, id);
      return {
        id,
        content,
      };
    } catch (err) {
      this.#logger.error(
        `Encountered an error while retrieving post with [id=${id}], [error=${err}]`,
      );
      throw new Error(`Unable to retrieve post with [id=${id}]`);
    }
  }

  async getPosts(): Promise<Array<RawContent>> {
    const allContent = await this.retrieveAllContent();
    return allContent;
  }

  private async retrieveAllContent(): Promise<Array<RawContent>> {
    const filesAndFolders = await readContentDirectory(this.#content_location);

    const fileContents = filesAndFolders.map(async (name) => ({
      id: name.split('.')[0],
      content: await readFileContent(this.#content_location, name),
    }));

    const retrievedFileContents = await Promise.allSettled(fileContents);

    const resolvedContent = retrievedFileContents
      .filter((result): result is PromiseFulfilledResult<RawContent> => {
        if (result.status === 'rejected') {
          this.#logger.warn(
            `Unable to extract content with [reason=${result.reason}]`,
          );
          return false;
        }

        return true;
      })
      .map((result) => result.value);

    return resolvedContent;
  }
}
