import express from 'express';
import { NotFoundError, BadRequestError } from '@tocstick/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  if (!req.params.id) {
    return next(new BadRequestError(`Invalid ticket id ${req.params.id}`));
  }

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return next(new NotFoundError());
    }
    res.status(200).send(ticket);
  } catch (error) {
    return next(new BadRequestError(`Invalid ticket id ${error}`));
  }
});

export { router as getTicketRouter };
