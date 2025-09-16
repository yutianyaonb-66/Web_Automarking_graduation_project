<template>
  <div class="registered">
    <div class="reg-content">
      <el-header>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">Main</el-breadcrumb-item>
          <el-breadcrumb-item>Search</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
      </el-header>
      <el-card class="box-card">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="registered"
          status-icon
          hide-required-asterisk
          class="regForm"
        >
          <el-form-item class="regTitle"><h2>Registered</h2></el-form-item>
          <el-form-item label="Firstname：" prop="firstname">
            <el-input
              v-model="ruleForm.firstname"
              prefix-icon="el-icon-user-solid"
              placeholder="Please input firstname"
            ></el-input>
          </el-form-item>
          <el-form-item label="Lastname：" prop="lastname">
            <el-input
              v-model="ruleForm.lastname"
              prefix-icon="el-icon-user"
              placeholder="Please input lastname"
            ></el-input>
          </el-form-item>
          <el-form-item label="Email：" prop="email">
            <el-input
              v-model="ruleForm.email"
              prefix-icon="el-icon-message"
              placeholder="Please input email address"
            ></el-input>
          </el-form-item>
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
          <div class="regBtn">
            <el-button type="primary" @click="submitForm()">Submit</el-button>
            <el-button @click="resize()">Reset</el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
//   import vNav from '../common/UserNav.vue';
  import {
    validateFirstname,
    validateLastname,
    validatePassword,
    validateCheckPass,
    checkMai,
  } from '../utils/validate';
  export default {
    name:"registered-list",
    data() {
      return {
        verify:false,
        flag: true,
        ruleForm: {
          firstname: '',
          lastname:'',
          password: '',
          checkPass: '',
          email: '',

        },
        rules: {
          firstname: [
            { required: true, validator: validateFirstname, trigger: 'blur' },
          ],
          lastname: [
            { required: true, validator: validateLastname, trigger: 'blur' },
          ],
          password: [
            { required: true, validator: validatePassword, trigger: 'blur' },
          ],
          checkPass: [
            { required: true, validator: validateCheckPass, trigger: 'blur' },
          ],
          email: [{ required: true, validator: checkMai, trigger: 'blur' }],
        },
      };
    },
    components: {
    //   vNav,
    },
    methods: {         
      submitForm() {
        var checkNull =
          this.ruleForm.firstname !== '' &&
          this.ruleForm.lastname !== '' &&
          this.ruleForm.password !== '' &&
          this.ruleForm.checkPass !== '' &&
          this.ruleForm.email !== '';
        if (checkNull) {
          if (this.ruleForm.password === this.ruleForm.checkPass) {
            this.$http
              .post('/reg', {
                firstname: this.ruleForm.firstname,
                lastname: this.ruleForm.lastname,
                email: this.ruleForm.email,
                password: this.$md5(this.ruleForm.password),
                verify:this.verify,
              })
              .then((res) => {
                if (res.data.flag) {
                  this.$message.success(res.data.message);
                //   this.$router.push('/#');
                } else {
                  this.$message.error(res.data.message);
                }
              });
             this.$http.post('/email',this.ruleForm).then((res)=>{
              console.log(res);
            });
             this.$router.push('/login');
          } else {
            this.$message.error('The passwords does not match, please re-enter!');
          }
        } else {
          this.$message.error('There are still incomplete items, please complete and submit!');
        }
      },
      resize() {
        (this.ruleForm.firstname = ''),
        (this.ruleForm.lastname = ''),
        (this.ruleForm.password = ''),
        (this.ruleForm.checkPass = ''),
        (this.ruleForm.email = '');
      },
    },
  };
</script>
<style scoped>
  .reg-content {
    width: 60%;
    margin: 50px auto;
  }

  .box-card {
    width: 100% !important;
  }

  .regForm {
    width: 60%;
    height: 800px;
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

  .regTitle {
    width: 150px;
    margin: 0 auto;
  }

  .regBtn {
    width: 100%;
    text-align: center;
  }

  .regBtn > .el-button {
    width: 80px;
    margin: 20px 30px;
  }
  
</style>