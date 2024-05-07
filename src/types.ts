type TextContent = {
  id: number;
  title: string;
  body: string;
};

type TextList = Pick<TextContent, 'id' | 'title'>;

type TextDetail = Pick<TextContent, 'title' | 'body'> | null;

export { TextContent, TextDetail, TextList };
