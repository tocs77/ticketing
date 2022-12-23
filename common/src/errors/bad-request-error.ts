import { SerializeableError } from './errorModels';

export class BadRequestError extends SerializeableError {
  statusCode = 400;
  message: string;
  constructor(message: string) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
