export type Frontmatter = {
  id: string;
  frontmatter: {
    title: string;
    date: Date;
  };
};

export type RawContent = {
  id: string;
  content: string;
};

export interface Source {
  getPosts: () => Promise<Array<RawContent>>;
  getPost: (id: string) => Promise<RawContent>;
}
