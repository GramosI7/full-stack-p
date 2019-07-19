const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Project = mongoose.model("project", projectSchema);
