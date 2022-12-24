import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('No jwt key in environment');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo Uri not defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log('Auth mongo connect error ', error);
  }
  app.listen(3000, () => {
    console.log('Tickets service listening on port 3000');
  });
};

start();
