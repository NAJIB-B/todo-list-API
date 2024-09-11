const catchAsync = require("../utils/catchAsync")

exports.protect = catchAsync( async(req, res, next) => {
  console.log(req.headers)
  res.json({
    message: 'success'
  })
})
