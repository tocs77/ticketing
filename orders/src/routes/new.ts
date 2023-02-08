import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from '@tocstick/common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const EXPIRATION_PERIOD_SECONDS = 15 * 60;
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
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return next(new NotFoundError());
    }

    const isReserved = await ticket.isReserved!();
    if (isReserved) return next(new BadRequestError(`Ticket for ${ticket.title} is already reserved`));

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_PERIOD_SECONDS);

    const order = await Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version!,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: { id: ticket.id, price: ticket.price },
    });
    res.status(201).send(order);
  }
);

export { router as createOrder };
