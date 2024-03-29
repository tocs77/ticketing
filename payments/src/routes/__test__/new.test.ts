import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/authHelper';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { OrderStatus } from '@tocstick/common';
import { Payment } from '../../models/payment';

//jest.mock('../../stripe.ts');

describe('New payment order tests', () => {
  it('has a route listening /api/payments post request', async () => {
    const response = await request(app).post('/api/payments').send({});
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if user is signed in', async () => {
    const response = await request(app).post('/api/payments').send({});
    expect(response.status).toEqual(401);
  });

  it('return status other than 401 for logged user', async () => {
    const response = await request(app).post('/api/payments').set('Cookie', signin()).send({});
    expect(response.status).not.toEqual(401);
  });

  it('return error if order doesn`t exists', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const token = 'ssddfff';
    await request(app).post('/api/payments').set('Cookie', signin()).send({ orderId, token }).expect(404);
  });

  it('return 401 if order doesn`t belongs to user', async () => {
    const order = await Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      price: 12,
      version: 0,
    });
    const token = 'ssddfff';
    await request(app).post('/api/payments').set('Cookie', signin()).send({ orderId: order.id, token }).expect(401);
  });

  it('return 400 if order cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = await Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: userId,
      status: OrderStatus.Cancelled,
      price: 12,
      version: 0,
    });
    const token = 'ssddfff';
    await request(app).post('/api/payments').set('Cookie', signin(userId)).send({ orderId: order.id, token }).expect(400);
  });

  it('return 201 for successfully created order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 10000);
    const order = await Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: userId,
      status: OrderStatus.Created,
      price,
      version: 0,
    });
    const token = 'tok_visa';
    await request(app).post('/api/payments').set('Cookie', signin(userId)).send({ orderId: order.id, token }).expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 40 });
    const charge = stripeCharges.data.find((c) => c.amount === price * 100);
    expect(charge).toBeDefined();
    expect(charge!.currency).toEqual('usd');
    const payment = await Payment.findOne({ stripeId: charge!.id });
    expect(payment?.orderId).toEqual(order.id);
  });
});
