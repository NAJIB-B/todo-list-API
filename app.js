const express = require("express");

const AppError = require("./utils/appError")
const userRouter = require("./routes/userRoute")
const todoRouter = require("./routes/todoRoute")


const app = express();

app.use(express.json())

app.use("/api/v1/users", userRouter)
app.use("/api/v1/todos", todoRouter)


app.all("*", (req, res, next) => {
  next(new AppError('Not found please check the url and try again', 404))

})

app.use((error, req, res, next) => {
  if (error.code === 11000) {

    const field = Object.keys(error.keyValue)[0]
    error.message = `${field} already in use, Please use a different ${field}`
    return res.status(400).json({

    message: error.message,
      status: 'fail',
      stack: error.stack
      

    })
  }
  res.status(error.statusCode).json({
    message: error.message,
    status: error.status,
    code: error.statusCode,
    stack: error.stack
  })
})


module.exports = app
