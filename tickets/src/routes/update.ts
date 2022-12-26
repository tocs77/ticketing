import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotAuthorizedError, NotFoundError } from '@tocstick/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put(
  '/:id',
  requireAuth,
  [
    body('title').trim().not().isEmpty().withMessage('Title is required'),
    body('price').trim().isFloat({ gt: 0 }).withMessage('Price have to be non negative number'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return next(new NotFoundError());
    if (ticket.userId !== req.currentUser?.id) return next(new NotAuthorizedError());
    ticket.price = price;
    ticket.title = title;
    await ticket.save();
    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
