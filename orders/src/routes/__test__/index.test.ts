import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/authHelper';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = await Ticket.build({ title: 'Concert 1', price: 44 });
  return ticket;
};

describe('Get all orders tests', () => {
  it('fetches oreds for particular user', async () => {
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    const user1 = signin();
    const user2 = signin();
    await request(app).post('/api/orders').set('Cookie', user1).send({ ticketId: ticket1.id }).expect(201);
    const { body: order1 } = await request(app)
      .post('/api/orders')
      .set('Cookie', user2)
      .send({ ticketId: ticket2.id })
      .expect(201);
    const { body: order2 } = await request(app)
      .post('/api/orders')
      .set('Cookie', user2)
      .send({ ticketId: ticket3.id })
      .expect(201);
    const response = await request(app).get('/api/orders').set('Cookie', user2);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order1.id);
    expect(response.body[1].id).toEqual(order2.id);
    expect(response.body[0].ticket.id).toEqual(ticket2.id);
    expect(response.body[1].ticket.id).toEqual(ticket3.id);
  });
});
