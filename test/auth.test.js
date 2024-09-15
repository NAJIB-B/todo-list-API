let expect;
(async () => {
  const chai = await import("chai");
  expect = chai.expect;
})();
const request = require("supertest");

const app = require("../app");
const Todo = require("../models/todoModel");
const User = require("../models/userModel");

let token1, token2, userId1, userId2, todoId;
describe("Authorization and authentication for Todo endpoint", function () {
  before(async () => {
    try {
      //create user 1
      const user1 = await request(app).post("/api/v1/users/register").send({
        name: "meee tooo",
        email: "test@gmail.com",
        password: "test1234",
        confirmPassword: "test1234",
      });

      token1 = user1.body.token;
      userId1 = user1.body.user._id;

      //create user 2
      const user2 = await request(app).post("/api/v1/users/register").send({
        name: "meee tooo",
        email: "test2@gmail.com",
        password: "test1234",
        confirmPassword: "test1234",
      });

      token2 = user2.body.token;
      userId2 = user2.body.user._id;

      // create todo with user1
      const todo = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", `Bearer ${token1}`)
        .send({
          title: "test title",
          description: "test description",
          owner: userId1,
        });

      todoId = todo.body.todo._id;
    } catch (err) {
      console.log(err);
    }
  });

  after(async() => {
    await User.findOneAndDelete({email: 'test@gmail.com'})
  })

  it("Should return 401 for missing authorization", function (done) {
    request(app)
      .get("/api/v1/todos")
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal("fail");
        done();
      });
  });

  it("Should return 403 for unauthorize access", function (done) {
    request(app)
      .get(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${token2}`)
      .expect(403)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.status).to.equal(403);
        expect(res.body.status).to.equal("fail");
        done();
      });
  });
});
