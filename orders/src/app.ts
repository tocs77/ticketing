import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@tocstick/common';
import { createOrder } from './routes/new';
import { getOrder } from './routes/show';
import { getAllOrders } from './routes';
import { deleteOrder } from './routes/delete';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }));
app.use(currentUser);

app.use('/api/orders', createOrder);
app.use('/api/orders', getOrder);
app.use('/api/orders', getAllOrders);
app.use('/api/orders', deleteOrder);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
