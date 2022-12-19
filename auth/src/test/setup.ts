import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let cleanfunc: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'dddd';
  const mongo = await MongoMemoryServer.create();
  cleanfunc = async () => await mongo.stop();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
  mongoose.set('strictQuery', false);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await cleanfunc();
  await mongoose.connection.close();
});
