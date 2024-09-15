const express = require("express");

const AppError = require("./utils/appError")
const userRouter = require("./routes/userRoute")
const todoRouter = require("./routes/todoRoute")
const errorController = require("./controllers/errorController")


const app = express();

app.use(express.json())

app.use("/api/v1/users", userRouter)
app.use("/api/v1/todos", todoRouter)


app.all("*", (req, res, next) => {
  next(new AppError('Not found please check the url and try again', 404))

})

app.use(errorController)


module.exports = app
