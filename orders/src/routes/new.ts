import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { NotFoundError, requireAuth, validateRequest } from '@tocstick/common';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Valid ticket id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = [1, 23];
    res.status(200).send(orders);
  }
);

export { router as createOrder };
