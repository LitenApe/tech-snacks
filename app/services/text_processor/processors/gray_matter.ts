import { Frontmatter, FrontmatterProcessor } from '../domain';

import { Logger } from '~/services/logger';
import matter from 'gray-matter';

export class GrayMatter implements FrontmatterProcessor {
  #logger;

  constructor() {
    this.#logger = new Logger('TextProcessor:GrayMatter');
  }

  getFrontmatter(content: string): Partial<Frontmatter> {
    this.#logger.debug(
      `Extracting frontmatter from content of [length=${content.length}]`,
    );

    const { data } = matter(content);
    return data;
  }

  getFrontmatterAndRawContent(rawContent: string): {
    frontmatter: Partial<Frontmatter>;
    content: string;
  } {
    this.#logger.debug(
      `Extracting frontmatter and content from content of [length=${rawContent.length}]`,
    );

    const { data, content } = matter(rawContent);
    return {
      content,
      frontmatter: data,
    };
  }
}