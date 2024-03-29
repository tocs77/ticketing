import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-canceled-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('No jwt key in environment');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo Uri not defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('Nats cluster id not defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('Nats client id not defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('Nats url not defined');
  }

  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
    natsWrapper.client.on('close', () => {
      console.log(`Client NATS connection closed`);
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log('Auth mongo connect error ', error);
  }
  app.listen(3000, () => {
    console.log('Tickets service listening on port 3000');
  });
};

start();
