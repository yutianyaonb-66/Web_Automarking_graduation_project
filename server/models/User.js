const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email:{type:String},  
  firstname:{type:String},
  lastname:{type:String},
  password:{type: String},
  verify:{type:Boolean},
  identity:{type:String},
});

// 实例化模型
const User = mongoose.model('Userlist', schema);

// 导出模型
module.exports = User;