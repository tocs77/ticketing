import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/authHelper';

describe('Show all tickets route tests', () => {
  it('can fetch list of all tickets', async () => {
    const t1 = { title: 'ticket 1', price: 15 };
    const t2 = { title: 'ticket 2', price: 25 };
    await request(app).post('/api/tickets').set('Cookie', signin()).send(t1).expect(201);
    await request(app).post('/api/tickets').set('Cookie', signin()).send(t2).expect(201);
    await request(app).post('/api/tickets').set('Cookie', signin()).send(t2).expect(201);

    const response = await request(app).get(`/api/tickets/`).send().expect(200);
    expect(response.body.length).toEqual(3);
  });
});
