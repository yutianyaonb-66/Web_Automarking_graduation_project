<!--This file is for the 'Change Password' page-->
<template>
  <div class="changpw">  
    <div class="changpw-content">
      <el-card class="box-card">        
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="changpw"
          hide-required-asterisk
          status-icon
          class="changpwForm"
        >
          <el-form-item class="changpwTitle"><h2>Please enter your new password</h2></el-form-item>
          <el-form-item label="Password：" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              prefix-icon="el-icon-lock"
              placeholder="Please input password"
            ></el-input>
          </el-form-item>
          <el-form-item label="Comfirm password：" prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              prefix-icon="el-icon-lock"
              placeholder="Please input password again"
              @keyup.enter.native="submitForm()"
            ></el-input>
          </el-form-item>
          <div class="changpwBtn">
            <el-button type="primary" @click="submitForm()" >Submit</el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {
    validatePassword,
    validateCheckPass,
  } from '../utils/validate';
export default {
    name:'change-pw',
    data() {
        return {
            ruleForm: {
                firstname:'',
                password: '',
                checkPass: '',
                email:'',
            },
            rules: {
                password: [
                    { required: true, validator: validatePassword, trigger: 'blur' },
                ],
                checkPass: [
                    { required: true, validator: validateCheckPass, trigger: 'blur' },],
                },
            message:{
                email:this.$route.query.id,
            },
        }
        
    },
    methods: {         
      submitForm() {
        var checkNull =
          this.ruleForm.password !== '' &&
          this.ruleForm.checkPass !== '';
        if (checkNull) {
          if (this.ruleForm.password === this.ruleForm.checkPass) {
            this.$http
              .post('/changepw', {
                password: this.$md5(this.ruleForm.password),
                email:this.ruleForm.email,
              })
              .then((res) => {
                if (res.data.flag) {
                  this.$message.success(res.data.message);
                //   this.$router.push('/#');
                } else {
                  this.$message.error(res.data.message);
                }
              });
             this.$router.push('/login');
          } else {
            this.$message.error('Two times the password does not match, please re-enter!');
          }
        } else {
          this.$message.error('There are still incomplete items, please complete and submit!');
        }
      },
    },
    created(){
        this.$http.post('getchangpw',this.message).then(res=>{
            if (res.data.flag===false){
                this.$message.error(res.data.message);
            }else{
                this.$message.success('Hi! '+ res.data.user.firstname + ', you can change password below.');
            }
            this.ruleForm.firstname = res.data.user.firstname
            this.ruleForm.email = res.data.user.email
        })
    }
}
</script>

<style scoped>
  .changpw-content {
    width: 60%;
    margin: 50px auto;
  }

  .box-card {
    width: 100% !important;
  }

  .changpwForm {
    width: 60%;
    height: 400px;
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

  .changpwTitle {
    width: 400px;
    margin: 0 auto;
  }

  .changpwBtn {
    width: 100%;
    text-align: center;
  }

  .changpwBtn > .el-button {
    width: 90px;
    margin: 20px 30px;
  }

</style>