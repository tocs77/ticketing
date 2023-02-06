import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, OrderStatus } from '@tocstick/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';

const setup = async () => {
  //Create instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //Create fake data event
  const data: OrderCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 456,
    },
    expiresAt: '3333',
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
  };

  //Create fake message object
  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

describe('Order created listener tests', () => {
  it('creates and saves order', async () => {
    //Call onMessage event with data + message
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);
    expect(order).toBeDefined();
    expect(order?.userId).toEqual(data.userId);
    expect(order?.price).toEqual(data.ticket.price);
  });

  it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });
});
