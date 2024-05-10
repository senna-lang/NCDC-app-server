import resetDatabase from '../utils/resetDatabase';
import supertest from 'supertest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = require('../app');

describe('/textContent', () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('/GET allTexts', () => {
    test('すべてのテキストコンテンツの取得', async () => {
      for (let i = 0; i < 3; i++) {
        await prisma.text.create({
          data: { title: `text${i}`, body: `text${i}:テストです` },
        });
      }
      const textList = await prisma.text.findMany({
        select: {
          id: true,
          title: true,
        },
      });
      const response = await supertest(app).get('/allTexts');
      expect(response.status).toBe(200);
      expect(JSON.parse(response.text)).toEqual(textList);
    });
  });

  describe('/GET textDetail/:id', () => {
    test('テキストの詳細を取得', async () => {
      for (let i = 0; i < 3; i++) {
        await prisma.text.create({
          data: { title: `text${i}`, body: `text${i}:テストです` },
        });
      }
      const textDetail = await prisma.text.findUnique({
        where: {
          id: 1,
        },
        select: {
          title: true,
          body: true,
        },
      });
      const response = await supertest(app).get('/textDetail/1');
      expect(response.status).toBe(200);
      expect(JSON.parse(response.text)).toEqual(textDetail);
    });

    test('存在しないidへのリクエストがあった時ステータスコード400が返ってくる', async () => {
      for (let i = 0; i < 3; i++) {
        await prisma.text.create({
          data: { title: `text${i}`, body: `text${i}:テストです` },
        });
      }
      const response = await supertest(app).get('/textDetail/5');
      expect(response.status).toBe(400);
    });
  });

  describe('/POST createText', () => {
    test('新規テキスト作成', async () => {
      const newText = await prisma.text.create({
        data: {
          title: 'テスト',
          body: 'テストです。',
        },
      });
      const response = await supertest(app).post('/createText').send({
        title: 'テスト',
        body: 'テストです。',
      });
      const jsonRes = JSON.parse(response.text);
      const replacedIdRes = { ...jsonRes, id: 1 };
      expect(response.status).toBe(200);
      expect(replacedIdRes).toEqual(newText);
    });
    test('titleとbodyが存在しないしない時ステータスコード400が返ってくる', async () => {
      const response = await supertest(app).post('/createText').send({
        title: null,
        body: null,
      });
      expect(response.status).toBe(400);
    });
  });

  describe('/PUT updateText/:id', () => {
    test('テキストの更新', async () => {
      for (let i = 0; i < 3; i++) {
        await prisma.text.create({
          data: { title: `text${i}`, body: `text${i}:テストです` },
        });
      }
      const updatedText = await prisma.text.update({
        where: { id: 1 },
        data: {
          title: '更新されたタイトル',
          body: '更新されたテキストです。',
        },
      });
      const response = await supertest(app)
        .put('/updateText/1')
        .send({
          data: {
            title: '更新されたタイトル',
            body: '更新されたテキストです。',
          },
        });
      expect(response.status).toBe(200);
      expect(JSON.parse(response.text)).toEqual(updatedText);
    });
    test('存在しないidへのリクエストがあった時ステータスコード400が返ってくる', async () => {
      for (let i = 0; i < 3; i++) {
        await prisma.text.create({
          data: { title: `text${i}`, body: `text${i}:テストです` },
        });
      }
      const response = await supertest(app)
        .put('/updateText/4')
        .send({
          data: {
            title: '更新されたタイトル',
            body: '更新されたテキストです。',
          },
        });
      expect(response.status).toBe(400);
    });
  });

  describe('/DELETE deleteText/:id', () => {
    test('テキストの削除', async () => {
      await prisma.text.create({
        data: { id: 1, title: 'テスト', body: `テストです` },
      });
      const deleteText = await prisma.text.delete({
        where: { id: 1 },
      });
      await prisma.text.create({
        data: { id: 1, title: 'テスト', body: `テストです` },
      });
      const response = await supertest(app)
        .delete('/deleteText/1')
        .send({
          where: { id: 1 },
        });
      expect(response.status).toBe(200);
      expect(JSON.parse(response.text)).toEqual(deleteText);
    });
    test('存在しないidへのリクエストがあった時ステータスコード400が返ってくる', async () => {
      await prisma.text.create({
        data: { id: 1, title: 'テスト', body: `テストです` },
      });
      const response = await supertest(app)
        .delete('/deleteText/4')
        .send({
          where: { id: 4 },
        });
      expect(response.status).toBe(400);
    });
  });
});
