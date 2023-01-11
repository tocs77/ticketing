import { Publisher, Subjects, OrderCancelledEvent } from '@tocstick/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
