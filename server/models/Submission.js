const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userlist",
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
  },
  file: { type: String },
  grade: { type: Number, default: null },
  markDate: { type: Date, default: null },
  comments: { type: String, default: null },
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "Userlist",
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
});

const Submission = mongoose.model('Submission', schema);

module.exports = Submission;
