const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  courseid:{type:String},  
  studentid:{type:String},
  lastname:{type:String},
  firstname:{type:String},
  course_code:{type:String},
  course_name:{type:String}
});

// 实例化模型
const EnrollRequest = mongoose.model('EnrollRequest', schema);

// 导出模型
module.exports = EnrollRequest;