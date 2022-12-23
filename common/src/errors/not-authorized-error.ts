import { SerializeableError } from './errorModels';

export class NotAuthorizedError extends SerializeableError {
  statusCode = 401;
  constructor() {
    super('Not authorized');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}
