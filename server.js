const mongoose = require("mongoose")


require("dotenv").config();
const app = require("./app")





const db = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(db)
  .then(() => console.log("Database connection successful"));



const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`server running at port ${port}`);
});

