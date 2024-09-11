const mongoose = require("mongoose");

const bycrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minLength: [8, "Password must have at least 8 characters"],
      select: false
    },
  },
  { timestamps: true },
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bycrypt.hash(this.password, 12)


  next()

})

userSchema.methods.correctPassword= async function(candidatePassword, correctPassword) {
  return await bycrypt.compare(candidatePassword, correctPassword)
}


const User = mongoose.model('User', userSchema)

module.exports = User
