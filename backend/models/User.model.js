const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true, // ✅ add back
  },
  email: {
    type: String,
    required: true,
    unique: true, // ✅ add back
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
});


module.exports = mongoose.model("User", UserSchema);