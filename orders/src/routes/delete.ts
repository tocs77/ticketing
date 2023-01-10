import express from 'express';
import mongoose from 'mongoose';
import { NotFoundError, BadRequestError, NotAuthorizedError, requireAuth, OrderStatus } from '@tocstick/common';
import { Order } from '../models/order';

const router = express.Router();

router.delete('/:orderId', requireAuth, async (req, res, next) => {
  const orderId = req.params.orderId;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return next(new BadRequestError('Provide valid order id'));
  }
  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    return next(new NotFoundError());
  }

  if (order.userId !== req.currentUser!.id) {
    return next(new NotAuthorizedError());
  }

  order.status = OrderStatus.Cancelled;
  await order.save();
  res.status(204).send(order);
});

export { router as deleteOrder };
