import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@tocstick/common';
import { createTicketRouter } from './routes/new';
import { getTicketRouter } from './routes/show';
import { getAlltickets } from './routes';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }));
app.use(currentUser);

app.use('/api/tickets', createTicketRouter);
app.use('/api/tickets', getTicketRouter);
app.use('/api/tickets', getAlltickets);
app.use('/api/tickets', updateTicketRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
