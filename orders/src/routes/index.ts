import express from 'express';
import { requireAuth } from '@tocstick/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate('ticket');
  res.status(200).send(orders);
});

export { router as getAllOrders };
