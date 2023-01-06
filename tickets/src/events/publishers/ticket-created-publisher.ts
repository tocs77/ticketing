import { Publisher, Subjects, TicketCreatedEvent } from '@tocstick/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
