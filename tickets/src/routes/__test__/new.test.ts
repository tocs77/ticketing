import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/authHelper';
import { Ticket } from '../../models/ticket';

describe('New ticket tests', () => {
  it('has a route listening /api/tickets post request', async () => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if user is signed in', async () => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).toEqual(401);
  });

  it('return status other than 401 for logged user', async () => {
    const response = await request(app).post('/api/tickets').set('Cookie', signin()).send({});
    expect(response.status).not.toEqual(401);
  });

  it('returns error if ivalid title was provided', async () => {
    await request(app).post('/api/tickets').set('Cookie', signin()).send({ title: '', price: 10 }).expect(400);
    await request(app).post('/api/tickets').set('Cookie', signin()).send({ price: 10 }).expect(400);
  });

  it('returns error if ivalid price was provided', async () => {
    await request(app).post('/api/tickets').set('Cookie', signin()).send({ title: 'ddd', price: -1 }).expect(400);
    await request(app).post('/api/tickets').set('Cookie', signin()).send({ title: 'rrrrr' }).expect(400);
  });

  it('creates a ticket with valid parameters', async () => {
    const price = 10;
    const title = 'test';
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    await request(app).post('/api/tickets').set('Cookie', signin()).send({ title, price }).expect(201);
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(price);
    expect(tickets[0].title).toEqual(title);
  });
});
