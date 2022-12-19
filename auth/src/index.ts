import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('No jwt key in environment');
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
  } catch (error) {
    console.log('Auth mongo connect error ', error);
  }
  app.listen(3000, () => {
    console.log('Auth service listening on port 3000');
  });
};

start();
