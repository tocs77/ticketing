import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@tocstick/common';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { ticket, id, status, version, userId } = data;
    await Order.build({ status, price: ticket.price, id, userId, version });
    msg.ack();
  }
}
