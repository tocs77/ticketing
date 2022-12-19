import request from 'supertest';
import { app } from '../../app';
import { signin, email } from '../../test/authHelper';

describe('Current user tests', () => {
  it('responds with details about current user', async () => {
    const cookie = await signin();
    const response = await request(app).get('/api/users/currentuser').set('Cookie', cookie).expect(200);
    expect(response.body.currentUser.email).toEqual(email);
  });

  it('empty currentuser for not auth user', async () => {
    const response = await request(app).get('/api/users/currentuser').expect(200);
    expect(response.body.currentUser).toEqual(null);
  });
});
