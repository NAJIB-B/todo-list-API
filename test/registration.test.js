require("dotenv").config();

let expect;

(async () => {
  const chai = await import("chai");
  expect = chai.expect;
})();

const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const User = require("../models/userModel");
const app = require("../app");

const req = request(app) // Re-assign request to another variable since the host is the same
const route = "/api/v1/users/register"
let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri(), { dbName: "testDB" });
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});


describe("User registration endpoint", function () {
  it("Should return a jwt token for successful user registration", function (done) {
    req
      .post(route)
      .send({
        email: "test@gmail.com",
        name: "test user",
        password: "test1234",
        confirmPassword: "test1234",
      })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body).to.have.property("token");
        done();
      });
  });

  it("Should return 400 if the registration details are not incorrect or incomplete", function (done) {
    req
      .post(route)
      .send({
        name: "test user",
        password: "test1234",
        confirmPassword: "test1234",
      })
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);

        done();
      });
  });
});
