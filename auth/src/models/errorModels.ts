export interface IOutError {
  message: string;
  field?: string;
}

export abstract class SerializeableError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, SerializeableError.prototype);
  }

  abstract serializeErrors(): IOutError[];
}
