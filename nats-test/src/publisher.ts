import nats from 'node-nats-streaming';
import crypto, { randomBytes } from 'crypto';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), { url: 'http://localhost:4222' });

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);

  setInterval(async () => {
    const data = {
      id: crypto.randomUUID(),
      title: 'concert',
      price: 25,
    };

    try {
      await publisher.publish(data);
    } catch (error) {
      console.error(error);
    }
  }, 2000);
});
