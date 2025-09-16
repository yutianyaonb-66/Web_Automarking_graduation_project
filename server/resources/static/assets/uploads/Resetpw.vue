<template>
  <div class="resetpw">  
    <div class="resetpw-content">
      <el-card class="box-card">        
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="resetpw"
          hide-required-asterisk
          status-icon
          class="resetpwForm"
        >
          <el-form-item class="resetpwTitle"><h2>Reset Password</h2></el-form-item>
          <el-form-item label="Please enter your email number：" prop="email">
            <el-input
              v-model="ruleForm.email"
              prefix-icon="el-icon-message"
              placeholder="Please enter your email address"
              @keyup.enter.native="submitForm()"
            ></el-input>
          </el-form-item>
          <div class="resetpwBtn">
            <el-button type="primary" @click="submitForm()">Submit</el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
    checkMai,
    } from '../utils/validate';
export default {
    name:'reset-password',
    data() {
        return {
            alarm:'',
            ruleForm:{
                email:'',
            },
            rules: {
                email: [
                { required: true, message: 'Please enter your email address！', trigger: 'blur' },
                { validator: checkMai, trigger: 'blur' },
                ],
            },
        }
    },
    methods: {
        submitForm() {
            var checkNull = this.ruleForm.email !== '';
            if (checkNull) {
                this.$http.post('/resetpw',this.ruleForm).then((res)=>{
                  if(res.data.flag){
                      this.$message.success(res.data.message);
                  }else{
                      this.$message.error(res.data.message);  
                  }                  
                    //this.alarm=res.data.message
                });
            }else{
                this.$message.error('Email is empty, please complete and submit!');
            }
        },
    }
}
</script>

<style scoped>
  .resetpw-content {
    width: 60%;
    margin: 50px auto;
  }

  .box-card {
    width: 100% !important;
  }

  .resetpwForm {
    width: 60%;
    height: 300px;
    margin: 50px auto;
  }

  .el-input--small > .el-input__inner {
    width: 100%;
    height: 50px;
    margin-top: 10px;
  }

  .el-input--small > .el-input__prefix > .el-input__icon {
    width: 26px;
    line-height: 70px;
  }

  .el-form-item__label {
    font-weight: bold;
    font-size: 16px;
  }

  .resetpwTitle {
    width: 200px;
    margin: 0 auto;
  }

  .resetpwBtn {
    width: 100%;
    text-align: center;
  }

  .resetpwBtn > .el-button {
    width: 90px;
    margin: 20px 30px;
  }

</style>