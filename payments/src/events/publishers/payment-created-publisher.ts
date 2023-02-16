import { Publisher, Subjects, PayemntCreatedEvent } from '@tocstick/common';

export class PaymentCreatedPublisher extends Publisher<PayemntCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
