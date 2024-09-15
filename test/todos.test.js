let expect;

(async () => {
  const chai = await import("chai");
  expect = chai.expect;
})();

const request = require("supertest");

const app = require("../app");
const User = require("../models/userModel");

let token, userId, todoId;
describe("Todos endpoint", function () {
  before(async () => {
    try {
      //create user
      const user = await request(app).post("/api/v1/users/register").send({
        name: "meee tooo",
        email: "test@gmail.com",
        password: "test1234",
        confirmPassword: "test1234",
      });

      token = user.body.token;
      userId = user.body.user._id;

      // create todo with user
      const todo = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "test title",
          description: "test description",
          owner: userId,
        });

      todoId = todo.body.todo._id;
    } catch (err) {
      console.log(err);
    }
  });

  it("Should return 201 for todo created successfully", function (done) {
    request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "test title",
        description: "test description",
        owner: userId,
      })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.status).to.equal(201)
        expect(res.body).to.have.property("todo");
        done();
      });
  });

  it("Should return 200 for getting a todo successfully", function (done) {
    request(app)
      .get(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.status).to.equal(200)
        expect(res.body).to.have.property("todo");
        done();
      });
  });

  it("Should return 201 for todo updated successfully", function (done) {
    request(app)
      .patch(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        completed: true,
      })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.status).to.equal(201)
        expect(res.body).to.have.property("todo");
        done();
      });
  });

  it("Should return 204 for todo deleted successfully", function (done) {
    request(app)
      .delete(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.status).to.equal(204)
        done();
      });
  });

});
