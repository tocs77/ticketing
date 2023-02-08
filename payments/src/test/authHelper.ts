import jwt from 'jsonwebtoken';

export const email = 'test@test.com';
import mongoose from 'mongoose';

export const signin = (id?: string): string[] => {
  const password = 'password';
  //Build a JWT payload
  id ? id : new mongoose.Types.ObjectId().toHexString();
  const payload = { id, email, password };
  //Create jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session object {jwt: ....}
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};
