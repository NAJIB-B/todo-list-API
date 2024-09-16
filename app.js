const express = require("express");
const rateLimit = require("express-rate-limit")
const slowDown =require("express-slow-down")
const cookieParser = require("cookie-parser")

const AppError = require("./utils/appError")
const userRouter = require("./routes/userRoute")
const todoRouter = require("./routes/todoRoute")
const errorController = require("./controllers/errorController")


const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: 'Too many request from this Ip. try again later'
})


const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 10,
  delayMs: (hits) => hits * 100
})



app.use(limiter)
app.use(speedLimiter)
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/users", userRouter)
app.use("/api/v1/todos", todoRouter)


app.all("*", (req, res, next) => {
  next(new AppError('Not found please check the url and try again', 404))

})

app.use(errorController)


module.exports = app
