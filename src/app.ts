import { PrismaClient } from '@prisma/client';
import express from 'express';
import { Express } from 'express';
import { TextContent, TextDetail, TextList } from './types';
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
          body: true,
        },
      });
      return res.status(200).json(textDetail);
    } catch (e) {
      return res.status(400).json(e);
    }
  }
);

app.post('/createText', async (req: express.Request, res: express.Response) => {
  try {
    const { title, body } = req.body;
    const newText: TextContent = await prisma.text.create({
      data: {
        title,
        body,
      },
    });
    return res.status(200).json(newText);
  } catch (e) {
    return res.status(400).json(e);
  }
});

app.put(
  '/updateText/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const id = Number(req.params.id);
      const { title, body } = req.body;
      const updatedText: TextContent = await prisma.text.update({
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
      const deleteText: TextContent = await prisma.text.delete({
        where: { id },
      });
      return res.status(200).json(deleteText);
    } catch (e) {
      return res.status(400).json(e);
    }
  }
);

module.exports = app
