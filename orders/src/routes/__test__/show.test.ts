import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/authHelper';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = await Ticket.build({ title: 'Concert 1', price: 44 });
  return ticket;
};

describe('Get order by id tests', () => {
  it('fetches the order', async () => {
    const ticket = await buildTicket();

    const user = signin();
    const orderResp = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id }).expect(201);
    const response = await request(app).get(`/api/orders/${orderResp.body.id}`).set('Cookie', user).expect(200);
    expect(response.body.id).toEqual(orderResp.body.id);
  });
  it('return not authorized error when user try to fetch some one order', async () => {
    const ticket = await buildTicket();
    const user = signin();
    const orderResp = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id }).expect(201);
    await request(app).get(`/api/orders/${orderResp.body.id}`).set('Cookie', signin()).expect(401);
  });
});
