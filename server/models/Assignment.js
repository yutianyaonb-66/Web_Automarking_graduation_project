const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:{type:String},  
  description:{type:String},
  files: [
    {
      type: Object,
      default: [],
    },
  ],
  answer:{type: String},
  skeleton:{type:String, default: null},
  start_date:{type: Date},
  end_date:{type: Date},
  score:[{
    criteria:{type: String},
    ratings:{type: String},
    pts:{type: Number}
  }],
  marksReleased: {
    type: Boolean,
    default: false,
  },
  totleScore:{type:Number}
});

// 实例化模型
const Assignment = mongoose.model('Assignment', schema);

// 导出模型
module.exports = Assignment;