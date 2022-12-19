import request from 'supertest';
import { app } from '../../app';

describe('Sugnin tests', () => {
  it('Returns a 400 code for invalid email', async () => {
    return request(app).post('/api/users/signin').send({ email: 'user1test.com', password: 'user1' }).expect(400);
  });

  it('Returns a 400 for email that doesn`t exists', async () => {
    return request(app).post('/api/users/signin').send({ email: 'user1@test.com', password: 'user1' }).expect(400);
  });

  it('Fails when incorrect password supplied', async () => {
    await request(app).post('/api/users/signup').send({ email: 'user1@test.com', password: 'user1' }).expect(201);
    await request(app).post('/api/users/signin').send({ email: 'user1@test.com', password: 'user12' }).expect(400);
  });

  it('Set cookies in success login', async () => {
    await request(app).post('/api/users/signup').send({ email: 'user1@test.com', password: 'user1' }).expect(201);
    const response = await request(app)
      .post('/api/users/signin')
      .send({ email: 'user1@test.com', password: 'user1' })
      .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
