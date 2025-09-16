const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {type:String},
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
  },
  testType: { type: String, default: 'javascript' },
  returnValue: { type: String },
  score: { type: Number },
  hidden: { type: String, default: 'public' },
});

const TestCase = mongoose.model('TestCase', schema);

module.exports = TestCase;
