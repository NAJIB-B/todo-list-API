let expect;

(async () => {
  const chai = await import("chai");
  expect = chai.expect;
})()

const request = require("supertest");


const app = require("../app");
const User = require("../models/userModel");





describe("User Login endpoint", function () {
  before(async () => {

    const user = await User.create({
      name: "meee tooo",
      email: "test@gmail.com",
      password: "test1234",
      confirmPassword: "test1234",
    });
  });

  after(async () => {
    await User.findOneAndDelete({email: 'test@gmail.com'})
  })

  it("Should return jwt for successful login", function (done) {
    request(app)
    .post("/api/v1/users/login")
    .send({
      email: "test@gmail.com",
      password: "test1234"
    })
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err)

      expect(res.body).to.have.property('token')
      done()
      

    })
  });

  it("Should return 400 for incorrect email", function (done) {
    request(app)
    .post("/api/v1/users/login")
    .send({
      email: "testgmail.com",
      password: "test1234"
    })
    .expect(400)
    .end(function(err, res) {
      if (err) return done(err)

      done()
      

    })
  });

  it("Should return 400 for missing  email", function (done) {
    request(app)
    .post("/api/v1/users/login")
    .send({
      password: "test1234"
    })
    .expect(400)
    .end(function(err, res) {
      if (err) return done(err)

      done()
      

    })
  });

  it("Should return 400 for missing  password", function (done) {
    request(app)
    .post("/api/v1/users/login")
    .send({
      email: "test@gmail.com"
    })
    .expect(400)
    .end(function(err, res) {
      if (err) return done(err)

      done()
      

    })
  });

  it("Should return 400 for incorrect email or password", function (done) {
    request(app)
    .post("/api/v1/users/login")
    .send({
      email: "test@gmail.com",
      password: "test12345"
    })
    .expect(400)
    .end(function(err, res) {
      if (err) return done(err)

      expect(res.status).to.equal(400)
      expect(res.body.message).to.equal('Email or Password is incorrect')

      done()
      

    })
  });
});
