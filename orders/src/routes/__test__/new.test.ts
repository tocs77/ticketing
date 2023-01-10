import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/authHelper';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus } from '@tocstick/common';

describe('New order tests', () => {
  it('has a route listening /api/orders post request', async () => {
    const response = await request(app).post('/api/orders').send({});
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if user is signed in', async () => {
    const response = await request(app).post('/api/orders').send({});
    expect(response.status).toEqual(401);
  });

  it('return status other than 401 for logged user', async () => {
    const response = await request(app).post('/api/orders').set('Cookie', signin()).send({});
    expect(response.status).not.toEqual(401);
  });

  it('return error if ticket doesn`t exists', async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await request(app).post('/api/orders').set('Cookie', signin()).send({ ticketId }).expect(404);
  });

  it('return error if ticket already reserved', async () => {
    const ticket = await Ticket.build({ title: 'Concert', price: 15 });
    await Order.build({
      status: OrderStatus.Created,
      userId: 'eeeeeee',
      expiresAt: new Date(),
      ticket: ticket,
    });
    await request(app).post('/api/orders').set('Cookie', signin()).send({ ticketId: ticket.id }).expect(400);
  });

  it('reserves a ticket', async () => {
    const ticket = await Ticket.build({ title: 'Concert', price: 15 });
    await request(app).post('/api/orders').set('Cookie', signin()).send({ ticketId: ticket.id }).expect(201);
  });

  it.todo('Emits order created event');
});
