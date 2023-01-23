import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedListener } from '../ticket-updated-listner';
import { TicketUpdatedEvent } from '@tocstick/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  //Create instance of listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = await Ticket.build({ title: 'Concert', price: 50 });

  //Create fake data event
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version! + 1,
    id: ticket.id,
    title: 'show',
    price: 345,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //Create fake message object
  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

describe('Ticket updated listener tests', () => {
  it('finds, updates and saves ticket', async () => {
    //Call onMessage event with data + message
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket?.title).toEqual(data.title);
    expect(ticket?.price).toEqual(data.price);
  });

  it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });

  it('doesn`t call ack if version in the future', async () => {
    const { listener, data, msg } = await setup();
    data.version++;

    try {
      await listener.onMessage(data, msg);
    } catch (error) {
      expect(msg.ack).not.toHaveBeenCalled();
      return;
    }
    throw new Error('Shouldn`t be here');
  });
});
