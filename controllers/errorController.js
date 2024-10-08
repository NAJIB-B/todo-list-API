const AppError = require("../utils/appError")

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: "${value}", Please use another value`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  return new AppError('Invalid token, Please login again', 401)
}

const handleJWTExpiredError = (err) => {
  return new AppError('Your token has expired, Please login again', 401)
}

module.exports = (error, req, res, next) => {
      if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

  if (error instanceof RangeError) {
    return res.json({
      message: 'this error type has not been handled',
      error
    })
  }
  console.log(`thsi is the error`, error)

  res.status(error.statusCode).json({
    message: error.message,
    status: error.status,
    code: error.statusCode,
    stack: error.stack
  })
}
