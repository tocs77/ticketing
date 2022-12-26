import { Request, Response, NextFunction } from 'express';

import { SerializeableError } from '../errors/errorModels';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SerializeableError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.error(err);
  res.status(400).send({ errors: [{ message: err.message }] });
};
