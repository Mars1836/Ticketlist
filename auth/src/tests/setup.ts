import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// This will create an new instance of "MongoMemoryServer" and automatically start it
let mongod: MongoMemoryServer;
beforeAll(async () => {
  {
    process.env.JWT_SECRET_LOCAL = "asdd";
    process.env.PASSWORD_SALTROUND = "10";
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri);
    // The Server can be stopped again with
  }
});
beforeEach(async () => {
  // clear all data in all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  //
});
afterAll(async () => {
  await mongod.stop();
  await mongoose.connection.close();
});
