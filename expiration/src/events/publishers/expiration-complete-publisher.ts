import { Publisher, Subjects, ExpirationCompleteEvent } from '@tocstick/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
