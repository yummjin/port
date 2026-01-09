export type Series = {
  title: string;
  contents: Post[];
};

export type Post = {
  title: string;
  body: string;
  image: string;
  date: string;
  href: string;
};

export type Tag = {
  id: string;
  name: string;
  posts_count: number;
};
