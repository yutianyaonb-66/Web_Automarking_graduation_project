<!--This file is for the 'Login' page-->
<template>
  <div class="login">  
    <div class="login-content">
      <el-card class="box-card">        
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="login"
          hide-required-asterisk
          status-icon
          class="loginForm"
        >
          <el-form-item class="loginTitle">
            <img src="../../assets/logo.png" class='logo' alt="">
            <h2>Login</h2>
          </el-form-item>
          <!--Notify the user to enter their email address-->
          <el-form-item label="Email：" prop="email">    
            <el-input
              type="email"
              v-model="ruleForm.email"
              prefix-icon="el-icon-message"
              placeholder="Please enter your email address"
            ></el-input>
          </el-form-item>
          <!--Notify the user to enter their password-->
          <el-form-item label="Password：" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              prefix-icon="el-icon-lock"
              placeholder="Please enter your password"
            ></el-input>
          </el-form-item>
          <!--The three buttons that can achieve login, register and reset the password-->
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
import jwt_decode from "jwt-decode";
import {
    checkMai,                       // These are used to verify the email address and password respectively
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
            { required: true, message: 'Please enter your email address！', trigger: 'blur' },                 // Pop up when the email address is empty
            { validator: checkMai, trigger: 'blur' },
          ],
          password: [
            { required: true, message: 'Please enter your password！', trigger: 'blur' },                     // Pop up when the user enter a wrong password
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
                    const { token } = res.data;
                    localStorage.setItem("eleToken", token);

                    // Parsing token
                    const decode = jwt_decode(token);

                    // Store the data
                    this.$store.dispatch("setIsAutnenticated", !this.isEmpty(decode));
                    this.$store.dispatch("setUser", decode);

                    // Page jumping
                    this.$router.push("/index");
                    // this.ruleForm = res.data.user;
                    // localStorage.setItem('eleToken',res.data.token);
                    // localStorage.setItem('ms_email',this.ruleForm.email);
                    // if(this.$route.query.redirect){
                    //   this.$router.push({path:decodeURIComponent(this.$route.query.redirect)});
                    // }else{
                    //   this.$router.push('/main');
                    // }
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
        },
        isEmpty(value) {
          return (
            value === undefined ||
            value === null ||
            (typeof value === "object" && Object.keys(value).length === 0) ||
            (typeof value === "string" && value.trim().length === 0)
      );
    }
    },
    components: {
    //   vNav,
    },
}
</script>

<style scoped>
  .login-content {
    width: 100%;
    height: 100vh;
    background-attachment: fixed;    /* 2023/5/21, fixed background board */
  }

  .box-card {
    width: 40% !important;
    /* height:75%; */
    margin: 0 auto;
    position: absolute;  /* 2023/5/21, fixed position */
    top: 50%;            /* 2023/5/21, 50% from the top */
    left: 50%;           /* 2023/5/21, 50% from the left */
    transform: translate(-50%, -50%);  
    border-radius: 10px; /* Set the rounded corner size */
  }

  .loginForm {
    width: 70%;
    height: 500px;
    margin: 20px auto;
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
    /*width: 150px;
    margin: 0 auto;  */
    font-weight: bold; 
    color: #333; 
    text-align: center;
    text-transform: uppercase;
  }

  .loginBtn {
    width: 100%;
    text-align: center;
  }

  .loginBtn >>> .el-button {
    width:150px;           /* Modified from 50px to 180px, by zf */
    margin: 50px 30px;
  }

  .login {
    background-color: hsl(213, 23%, 38%); /* set the background color */
  }

  .logo {
    height: 80px;
    width: 80px;
}
</style>