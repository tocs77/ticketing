import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects, NotFoundError } from '@tocstick/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new NotFoundError();

    ticket.orderId = undefined;
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version!,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
