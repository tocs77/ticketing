import { ValidationError } from 'express-validator';
import { SerializeableError, IOutError } from './errorModels';

export class RequestValidationError extends SerializeableError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): IOutError[] {
    const formattedErrors: IOutError[] = this.errors.map((e) => {
      return { message: e.msg, field: e.param };
    });
    return formattedErrors;
  }
}
