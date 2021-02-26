const { Schema, model } = require("mongoose")


const UserSchema = new Schema(
  {
    username: String,
    socketId: String,

   
  },
  { timestamps: true }
)



module.exports = model("users", UserSchema)
