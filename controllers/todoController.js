const {validationResult} = require("express-validator")

const Todo = require("../models/todoModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")


exports.createTodo = catchAsync( async(req, res, next) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    next(new AppError(errors, 400))
  }

  req.body.owner = req.user.id

  const todo = await Todo.create(req.body);

  res.status(201).json({
    message: 'success',
    todo
  })

})

exports.getAllTodos = catchAsync( async(req, res, next) => {
  const id = req.user.id

  const todos = await Todo.find({owner : id})

  res.status(200).json({
    message: 'success',
    results: todos.length,
    todos
  })
})

exports.getATodo = catchAsync( async(req, res, next) => {
  const todoId = req.params.todo

  const todo = await Todo.findById(todoId)

  res.status(200).json({
    message: 'success',
    todo
  })
})

exports.updateATodo = catchAsync( async(req, res, next) => {
  const todoId = req.params.todo

  const todo = await Todo.findByIdAndUpdate(todoId, req.body, {
    new: true
  })

  res.status(201).json({
    message: 'success',
    todo
  })
})

exports.deleteATour = catchAsync( async(req, res, next) => {
  const todoId = req.params.todo

  await Todo.findByIdAndDelete(todoId)

  res.status(204).json({
    message: 'success',
  })
})


