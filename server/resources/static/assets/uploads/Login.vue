<template>
  <div class="login">  
    <div class="login-content">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">Main</el-breadcrumb-item>
          <el-breadcrumb-item>Login</el-breadcrumb-item>
          <el-divider></el-divider>
        </el-breadcrumb>
      <el-card class="box-card">        
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="login"
          hide-required-asterisk
          status-icon
          class="loginForm"
        >
          <el-form-item class="loginTitle"><h2>Login</h2></el-form-item>
          <el-form-item label="Email：" prop="email">
            <el-input
              v-model="ruleForm.email"
              prefix-icon="el-icon-message"
              placeholder="Please enter your email address"
            ></el-input>
          </el-form-item>
          <el-form-item label="Password：" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              prefix-icon="el-icon-lock"
              placeholder="Please enter your password"
            ></el-input>
          </el-form-item>
          <div class="loginBtn">
            <el-button type="primary" @click="submitForm()">Login</el-button>            
            <el-button type="primary" @click="register()">Register</el-button>
            <el-link type="danger" @click="resize()">Forgotten Password</el-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
// import vNav from '../common/UserNav.vue';
import {
    checkMai,
    validatePassword,
    } from '../utils/validate';
export default {
    name:"login-list",
    data() {
        return {
            ruleForm:{
                email:'',
                password:'',
            },
        rules: {
          email: [
            { required: true, message: 'Please enter your email address！', trigger: 'blur' },
            { validator: checkMai, trigger: 'blur' },
          ],
          password: [
            { required: true, message: 'Please enter your password！', trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur' },
          ],
        },
        }
    },
    methods:{
        submitForm(){
          this.ruleForm.password = this.$md5(this.ruleForm.password)
            this.$http.post('login',this.ruleForm).then(res=>{
                if(res.data.flag){
                    this.$message.success(res.data.message);
                    this.ruleForm = res.data.user;
                    localStorage.setItem('token',res.data.token);
                    localStorage.setItem('ms_email',this.ruleForm.email);
                    if(this.$route.query.redirect){
                      this.$router.push({path:decodeURIComponent(this.$route.query.redirect)});
                    }else{
                      this.$router.push('/main');
                    }
                    // this.$router.push(this.$route.query.redirect || '/')
                    
                }else{
                    this.$message.error(res.data.message);
                }
            })
        },
        resize() {
           this.$router.push('/resetpw')
        },
        register(){
          this.$router.push('/reg')
        }
    },
    components: {
    //   vNav,
    },
}
</script>

<style scoped>
  .login-content {
    width: 60%;
    margin: 50px auto;
  }

  .box-card {
    width: 100% !important;
  }

  .loginForm {
    width: 60%;
    height: 500px;
    margin: 50px auto;
  }

  .el-form-item {
    margin-top: 50px;
  }

  .el-input--small >>> .el-input__inner {
    width: 100%;
    height: 50px;
    margin-top: 10px;
  }

  .el-input--small >>> .el-input__prefix .el-input__icon {
    width: 26px;
    line-height: 70px;
  }

  .el-form-item__label {
    font-weight: bold;
    font-size: 16px;
  }

  .loginTitle {
    width: 150px;
    margin: 0 auto;
  }

  .loginBtn {
    width: 100%;
    text-align: center;
  }

  .loginBtn >>> .el-button {
    width: 90px;
    margin: 50px 30px;
  }
</style>