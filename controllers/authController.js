const jwt = require("jsonwebtoken")
const {promisify} = require("util")

const User = require("../models/userModel")
const Todo = require("../models/todoModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

exports.protect = catchAsync( async(req, res, next) => {
  let token
  if (req.headers.authorization && (req.headers.authorization).startsWith('Bearer')) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return next(new AppError('You are not logged in, please login to access this route', 401))
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const currentUser = await User.findById(decoded.id)

  if (!currentUser) {
    return next(new AppError('The user that owns this token no longer exist', 401))
  }


  req.user = currentUser;
  next()
})

exports.authorize = catchAsync( async(req, res,next) => {
  const todo = await Todo.findById(req.params.todo)

  if (!todo) {
   return next(new AppError("No todo found with that ID", 404))
  }
  if (todo.owner.toString() !== req.user.id) {
    return next(new AppError("You are not authorized to access this todo", 403))
  }

  next()
})
