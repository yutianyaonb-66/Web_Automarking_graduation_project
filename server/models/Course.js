const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  course_code:{type:String},  
  course_name:{type:String},
  assignment:[
    {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: 'Assignment',
    },
  ],
  description:{type:String},
  course_credit:{type:Number},
  approved:{type:Boolean,default: false},
  user:[{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'Userlist',
  }],
  tutor:[{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'Userlist',
  }],
});

// 实例化模型
const Course = mongoose.model('Course', schema);

// 导出模型
module.exports = Course;