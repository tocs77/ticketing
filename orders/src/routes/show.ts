import express from 'express';
import { NotFoundError } from '@tocstick/common';

const router = express.Router();

router.get('/:orderId', async (req, res, next) => {
  const orders = [1, 23];
  res.status(200).send(orders);
});

export { router as getOrder };
