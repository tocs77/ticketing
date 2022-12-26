import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/authHelper';
import mongoose from 'mongoose';

describe('Show ticket route tests', () => {
  it('returns 404 if ticket not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).set('Cookie', signin()).send().expect(404);
  });

  it('returns ticket if ticket was found', async () => {
    const price = 10;
    const title = 'test';
    const cookie = signin();
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title, price }).expect(201);

    const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
  });
});
