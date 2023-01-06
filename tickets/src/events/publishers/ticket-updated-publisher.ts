import { Publisher, Subjects, TicketUpdatedEvent } from '@tocstick/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
