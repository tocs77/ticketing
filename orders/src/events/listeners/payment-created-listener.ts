import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PayemntCreatedEvent, OrderStatus } from '@tocstick/common';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PayemntCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PayemntCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) throw new Error('Order not found');

    if (order.status !== OrderStatus.Created) {
      msg.ack();
      return;
    }

    order.status = OrderStatus.Complete;
    await order.save();

    msg.ack();
  }
}
