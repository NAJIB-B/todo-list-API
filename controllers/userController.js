const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createTokenAndSendResponse = (user, statusCode, res) => {

  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
}



exports.createUser = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError(errors, 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new AppError(
        "The password and confirmPassword field has to be the same",
        400,
      ),
    );
  }

  const user = await User.create(req.body);
  createTokenAndSendResponse(user, 201, res)

});


exports.loginUser = catchAsync( async(req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError(errors, 400));
  }
 
  const user = await User.findOne({email: req.body.email}).select('+password')

  if (!user || !(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError("Email or Password is incorrect", 400))

  }
  createTokenAndSendResponse(user, 200, res)

})
