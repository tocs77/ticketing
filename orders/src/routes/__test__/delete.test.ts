import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/authHelper';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { OrderStatus } from '@tocstick/common';
import { natsWrapper } from '../../nats-wrapper';

interface FetchedOrder extends Order {
  id: string;
}

const buildTicket = async () => {
  const ticket = await Ticket.build({ title: 'Concert 1', price: 44 });
  return ticket;
};

describe('Cancel order tests', () => {
  it('Cancel the order', async () => {
    const ticket = await buildTicket();

    const user = signin();

    const { body: order }: { body: FetchedOrder } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    expect(order.status).toEqual(OrderStatus.Created);

    await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).expect(204);

    const { body: deletedOrder }: { body: FetchedOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .expect(200);

    expect(deletedOrder.status).toEqual(OrderStatus.Cancelled);
  });

  it('Emits order cancelled event', async () => {
    const ticket = await buildTicket();

    const user = signin();

    const { body: order }: { body: FetchedOrder } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);
    jest.clearAllMocks();
    await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).expect(204);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
