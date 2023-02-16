import { Subjects } from './subjects';

export interface PayemntCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
