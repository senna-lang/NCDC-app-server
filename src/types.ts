export type Author = {
  id: number;
  name: string;
};
type TextContent = {
  id: number;
  title: string;
  author: Author;
  body: string;
};

type TextList = Pick<TextContent, 'id' | 'title'>;

type TextDetail = Pick<TextContent, 'title' | 'body' | 'author'> | null;

export { TextContent, TextDetail, TextList };
