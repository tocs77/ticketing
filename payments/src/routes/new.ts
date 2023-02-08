import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@tocstick/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';

const router = express.Router();
router.post(
  '/',
  requireAuth,
  [
    body('orderId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Valid order id must be provided'),
    body('token').not().isEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('Called create payment');
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new NotFoundError());
    }

    if (order.userId !== req.currentUser?.id) {
      return next(new NotAuthorizedError());
    }

    if (order.status === OrderStatus.Cancelled) {
      return next(new BadRequestError('Order was cancelled'));
    }

    await stripe.charges.create({ currency: 'usd', amount: order.price * 100, source: token });

    res.status(201).send(order);
  }
);

export { router as createChargeRouter };
