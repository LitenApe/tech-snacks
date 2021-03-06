import type { Source } from '../domain';

class GitHub implements Source {
  async getPosts(): Promise<Array<unknown>> {
    return [];
  }

  async getPost(id: string): Promise<unknown> {
    return {
      id,
    };
  }
}

/**
const filesQuery = `
query {
  repository(owner: "LitenApe", name: "tech-snacks") {
    object(expression: "main:app/content") {
      ... on Tree {
        entries {
          name
        }
      }
    }
  }
}`;

const fileQuery = `
query {
  repository(owner: "LitenApe", name: "tech-snacks") {
    object(expression: "main:app/content/markdown.md") {
      ... on Blob {
        text
      }
    }
  }
}
`;
*/

export const instance = new GitHub();
