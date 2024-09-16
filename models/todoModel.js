const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A todo must have a title"],
  },
  description: {
    type: String,
    required: [true, "A todo must have a description"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, "A todo must have an owner"],
    index: 1
  }
});


const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo
