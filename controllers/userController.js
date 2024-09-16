const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const {promisify} = require('util')

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
};

const createTokenAndSendResponse = (user, statusCode, res) => {

  const token = signAccessToken (user._id);

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
  
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN})

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000
  })

  
  createTokenAndSendResponse(user, 200, res)

})

exports.createAccessToken = catchAsync( async (req, res, next) => {

  const cookie = req.cookies?.jwt


  if (!cookie) {
    return next(new AppError('Session has expired. Please log in again.', 401))
  }

  const decoded = await promisify(jwt.verify)(cookie, process.env.JWT_REFRESH_SECRET)

  const currentUser = await User.findById(decoded.id)

  createTokenAndSendResponse(currentUser, 200, res)

})
