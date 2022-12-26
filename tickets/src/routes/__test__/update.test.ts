import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/authHelper';
import mongoose from 'mongoose';

describe('Update ticket route tests', () => {
  it('returns 401 if user not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`).send({ title: 'ww', price: 10 }).expect(401);
  });

  it('returns 404 if ticket not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`/api/tickets/${id}`).set('Cookie', signin()).send({ title: 'ww', price: 10 }).expect(404);
  });

  it('returns 401 if user doesnt own ticket', async () => {
    const price = 10;
    const title = 'test';
    const response = await request(app).post('/api/tickets').set('Cookie', signin()).send({ title, price }).expect(201);
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', signin())
      .send({ title: 'ww', price: 10 })
      .expect(401);
  });

  it('returns 400 if user provided invalid title or price', async () => {
    const cookie = signin();
    const price = 10;
    const title = 'test';
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title, price }).expect(201);
    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ title: '', price: 10 }).expect(400);
    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ price: 10 }).expect(400);
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'ww', price: -10 })
      .expect(400);
    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ title: 'ww' }).expect(400);
  });

  it('successfully updated ticket', async () => {
    const cookie = signin();
    const price = 10;
    const title = 'test';
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title, price }).expect(201);
    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ title: 'ww', price: 15 }).expect(200);

    const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);
    expect(ticketResponse.body.title).toEqual('ww');
    expect(ticketResponse.body.price).toEqual(15);
  });
});
