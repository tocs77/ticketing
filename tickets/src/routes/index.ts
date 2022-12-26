import express from 'express';
import { NotFoundError } from '@tocstick/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const tickets = await Ticket.find({});
  if (!tickets) {
    return next(new NotFoundError());
  }
  res.status(200).send(tickets);
});

export { router as getAlltickets };
