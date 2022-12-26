import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError } from '@tocstick/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [
    body('title').trim().not().isEmpty().withMessage('Title is required'),
    body('price').trim().isFloat({ gt: 0 }).withMessage('Price have to be non negative number'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;

    try {
      const ticket = await Ticket.create({ title, price, userId: req.currentUser?.id });
      res.status(201).send(ticket);
    } catch (error) {
      return next(new BadRequestError('Error creating ticket'));
    }
  }
);

export { router as createTicketRouter };
