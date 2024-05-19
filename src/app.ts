import { PrismaClient } from '@prisma/client';
import express from 'express';
import { Express } from 'express';
import { Author, TextContent, TextDetail, TextList } from './types';
import cors from 'cors';

const app: Express = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const prisma = new PrismaClient();

app.get('/allTexts', async (req: express.Request, res: express.Response) => {
  try {
    const allTexts: TextList[] = await prisma.text.findMany({
      select: {
        id: true,
        title: true,
      },
    });
    return res.status(200).json(allTexts);
  } catch (e) {
    return res.status(400).json(e);
  }
});

app.get(
  '/textDetail/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const id = Number(req.params.id);
      const textDetail: TextDetail = await prisma.text.findUnique({
        where: {
          id,
        },
        select: {
          title: true,
          author: true,
          body: true,
        },
      });
      if (!textDetail) {
        throw new Error();
      }
      return res.status(200).json(textDetail);
    } catch (e) {
      return res.status(400).json(e);
    }
  }
);

app.get('/authorList', async (req: express.Request, res: express.Response) => {
  try {
    const authorList: Author[] = await prisma.author.findMany();
    if (!authorList) {
      throw new Error();
    }
    return res.status(200).json(authorList);
  } catch (e) {
    return res.status(400).json(e);
  }
});

app.post('/createText', async (req: express.Request, res: express.Response) => {
  try {
    const { title, body, authorId } = req.body;
    const newText = await prisma.text.create({
      data: {
        title,
        body,
        author: {
          connect: { id: authorId },
        },
      },
    });
    return res.status(200).json(newText);
  } catch (e) {
    return res.status(400).json(e);
  }
});

app.post(
  '/createAuthor',
  async (req: express.Request, res: express.Response) => {
    try {
      const { author } = req.body;
      const newAuthor = await prisma.author.create({
        data: {
          name: author,
        },
      });
      return res.status(200).json(newAuthor);
    } catch (e) {
      return res.status(400).json(e);
    }
  }
);

app.put(
  '/updateText/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const id = Number(req.params.id);
      const { title, body } = req.body;
      const updatedText = await prisma.text.update({
        where: { id },
        data: {
          title,
          body,
        },
      });
      return res.status(200).json(updatedText);
    } catch (e) {
      return res.status(400).json(e);
    }
  }
);

app.delete(
  '/deleteText/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const id = Number(req.params.id);
      const deleteText = await prisma.text.delete({
        where: { id },
      });
      return res.status(200).json(deleteText);
    } catch (e) {
      return res.status(400).json(e);
    }
  }
);

app.delete(
  '/deleteAuthor/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const id = Number(req.params.id);
      const deleteText = prisma.text.deleteMany({
        where: { authorId: id },
      });
      const deleteAuthor = prisma.author.delete({
        where: { id },
      });
      const transaction = await prisma.$transaction([deleteText, deleteAuthor]);
      return res.status(200).json(transaction);
    } catch (e) {
      return res.status(400).json(e);
    }
  }
);

module.exports = app;
