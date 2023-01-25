import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, TicketUpdatedEvent } from '@tocstick/common';
import { OrderCancelledListener } from '../order-canceled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = await Ticket.build({ title: 'Concert', price: 123, userId: '4444', orderId });

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe('order canceled listener tests', () => {
  it('sets orderId of ticket to undefined', async () => {
    const { listener, data, msg } = await setup();
    const tickeBefore = await Ticket.findById(data.ticket.id);
    expect(tickeBefore?.orderId).toEqual(data.id);
    await listener.onMessage(data, msg);
    const ticket = await Ticket.findById(data.ticket.id);
    expect(ticket?.orderId).not.toBeDefined();
  });

  it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });

  it('publishes ticket updated event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData: TicketUpdatedEvent['data'] = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(ticketUpdatedData.orderId).not.toBeDefined();
  });
});
