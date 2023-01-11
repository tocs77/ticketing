import { Publisher, Subjects, OrderCreatedEvent } from '@tocstick/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
