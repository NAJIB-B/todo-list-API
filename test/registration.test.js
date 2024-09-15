require("dotenv").config();

let expect;

(async () => {
  const chai = await import("chai");
  expect = chai.expect;
})();

const request = require("supertest");

const User = require("../models/userModel");
const app = require("../app");

const req = request(app); // Re-assign request to another variable since the host is the same
const route = "/api/v1/users/register";

describe("User registration endpoint", function () {
  it("Should return a jwt token for successful user registration", function (done) {
    req
      .post(route)
      .send({
        email: "testUser@gmail.com",
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

  it("Should return 400 if the email is incorrect", function (done) {
    req
      .post(route)
      .send({
        email: "megmail.com",
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

  // Looping over required fields and testing if any required field is missing from the request body
  const requiredFields = ["email", "name", "password", "confirmPassword"];

  const requestBody = {
    email: "test@gmail.com",
    name: "test name",
    password: "test1234",
    confirmPassword: "test1234",
  };

  for (const field of requiredFields) {
    const incorrectRequestBody = { ...requestBody };
    delete incorrectRequestBody[field];

    it(`Should return 400 if ${field} is missing`, function (done) {
      req
        .post(route)
        .send(incorrectRequestBody)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal("fail");

          done();
        });
    });
  }

  it("Should return 400 if the password and confirmPassword are not the same", function (done) {
    req
      .post(route)
      .send({
        email: "najib@gmail.com",
        name: "test user",
        password: "test1234",
        confirmPassword: "test12345",
      })
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);

        done();
      });
  });
});
