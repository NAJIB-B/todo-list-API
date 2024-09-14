
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");


let mongoServer;


beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri(), { dbName: "testDB" });
});

afterEach(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
