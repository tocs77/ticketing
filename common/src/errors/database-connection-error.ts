import { SerializeableError } from './errorModels';

export class DatabaseConnectionError extends SerializeableError {
  statusCode = 500;
  public reason = 'Error connectiong to database';
  constructor() {
    super('Error connectiong to database');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
