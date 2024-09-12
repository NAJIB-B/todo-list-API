const express = require("express");
const { body } = require("express-validator");

const { protect, authorize } = require("../controllers/authController");
const {
  createTodo,
  getAllTodos,
  getATodo,
  updateATodo,
  deleteATour,
} = require("../controllers/todoController");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(
    [
      body("title").notEmpty().withMessage("A todo must have a title"),
      body("description")
        .notEmpty()
        .withMessage("A todo must have a description"),
    ],
    createTodo,
  )
  .get(getAllTodos);

router
  .route("/:todo")
  .get(authorize, getATodo)
  .patch(authorize, updateATodo)
  .delete(authorize, deleteATour);

module.exports = router;
