import express from 'express';
import { NotFoundError } from '@tocstick/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return next(new NotFoundError());
  }
  res.status(200).send(ticket);
});

export { router as getTicketRouter };
