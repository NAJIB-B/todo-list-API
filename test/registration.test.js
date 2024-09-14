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

  it("Should return 400 if the email is missing", function (done) {
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

  it("Should return 400 if the name is missing", function (done) {
    req
      .post(route)
      .send({
        email: "najib@gmail.com",
        password: "test1234",
        confirmPassword: "test1234",
      })
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);

        done();
      });
  });

  it("Should return 400 if the password is missing", function (done) {
    req
      .post(route)
      .send({
        email: "najib@gmail.com",
        name: "test user",
        confirmPassword: "test1234",
      })
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);

        done();
      });
  });

  it("Should return 400 if the confirmPassword is missing", function (done) {
    req
      .post(route)
      .send({
        email: "najib@gmail.com",
        name: "test user",
        password: "test1234",
      })
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);

        done();
      });
  });

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
