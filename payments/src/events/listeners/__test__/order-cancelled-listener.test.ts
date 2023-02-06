import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent, OrderStatus } from '@tocstick/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';

const setup = async () => {
  //Create instance of listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 222,
    version: 0,
    userId: 'ffff',
  });

  //Create fake data event
  const data: OrderCancelledEvent['data'] = {
    version: 1,
    id: order.id,
    ticket: {
      id: 'sssss',
    },
  };

  //Create fake message object
  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

describe('Order cancelled listener tests', () => {
  it('cnages status of order to cancelled', async () => {
    //Call onMessage event with data + message
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);
    expect(order).toBeDefined();
    expect(order?.status).toEqual(OrderStatus.Cancelled);
  });

  it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });
});
