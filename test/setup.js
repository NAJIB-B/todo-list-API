
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");


let mongoServer;


before(async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri(), { dbName: "testDB" });
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
