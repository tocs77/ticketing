import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { ExpirationCompleteEvent, OrderStatus } from '@tocstick/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const setup = async () => {
  //Create instance of listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = await Ticket.build({ title: 'Concert', price: 50, id: new mongoose.Types.ObjectId().toHexString() });
  const order = await Order.build({
    userId: 'dddd',
    expiresAt: new Date(),
    ticket,
    status: OrderStatus.Created,
  });

  //Create fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  //Create fake message object
  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

describe('Order expiration complete listener tests', () => {
  it('updates order status to cancelled', async () => {
    //Call onMessage event with data + message
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(data.orderId);
    expect(order?.status).toEqual(OrderStatus.Cancelled);
  });

  it('emits order cancelled event', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const { id } = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(id).toEqual(data.orderId);
  });

  it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });
});
