import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@tocstick/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

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

    const charge = await stripe.charges.create({ currency: 'usd', amount: order.price * 100, source: token });
    const payment = await Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send(payment);
  }
);

export { router as createChargeRouter };
