import request from 'supertest';
import { app } from '../../app';

describe('Sugnup tests', () => {
  it('Returns a 201 code for successfull signup', async () => {
    return request(app).post('/api/users/signup').send({ email: 'user1@test.com', password: 'user1' }).expect(201);
  });

  it('Returns a 400 code for invalid email', async () => {
    return request(app).post('/api/users/signup').send({ email: 'user1test.com', password: 'user1' }).expect(400);
  });

  it('Returns a 400 code for invalid password', async () => {
    return request(app).post('/api/users/signup').send({ email: 'user1@test.com', password: 'us' }).expect(400);
  });

  it('Returns a 400 code with missing email and password', async () => {
    await request(app).post('/api/users/signup').send({ password: 'useeeee' }).expect(400);
    await request(app).post('/api/users/signup').send({ email: 'user1@test.com' }).expect(400);
  });

  it('Disallow duplicate email', async () => {
    await request(app).post('/api/users/signup').send({ email: 'user1@test.com', password: 'user1' }).expect(201);
    await request(app).post('/api/users/signup').send({ email: 'user1@test.com', password: 'user1' }).expect(400);
  });

  it('sets cookie after sucessful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({ email: 'user3@test.com', password: 'user1' })
      .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
