import { MongoMemoryServer } from "mongodb-memory-server";

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { _const } from "@cl-ticket/common";
import { randomBytes } from "crypto";
// This will create an new instance of "MongoMemoryServer" and automatically start it
let mongod: MongoMemoryServer;
declare global {
  var login: () => string[];
}
function getRandomSuffix(): string {
  return randomBytes(23).toString("hex");
}
global.login = () => {
  const payload = {
    email: `test${getRandomSuffix()}@gmail.com`,
    id: new mongoose.Types.ObjectId().toString(),
  };
  const payloadSign = jwt.sign(payload, _const.jwtSecret!);
  const coo = Buffer.from(JSON.stringify({ jwt: payloadSign })).toString(
    "base64"
  );
  const cookies = [`session=${coo}`];
  return cookies;
};
jest.mock("../connect/nat");

beforeAll(async () => {
  {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri);
    // The Server can be stopped again with
  }
});
beforeEach(async () => {
  // clear all data in all collections
  jest.clearAllMocks();
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
