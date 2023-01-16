import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError } from '@tocstick/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

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
      new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        version: ticket.version!,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });
      res.status(201).send(ticket);
    } catch (error) {
      return next(new BadRequestError('Error creating ticket'));
    }
  }
);

export { router as createTicketRouter };
