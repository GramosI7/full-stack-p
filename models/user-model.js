const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  google: {
    username: String,
    googleId: String,
    thumbnail: String
  }
});

module.exports = User = mongoose.model("user", userSchema);
