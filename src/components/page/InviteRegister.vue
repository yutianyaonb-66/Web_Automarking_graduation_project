<template>
  <div class="registered">
    <div class="reg-content">
      <el-header> </el-header>
      <el-card class="box-card">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="registered"
          status-icon
          hide-required-asterisk
          class="regForm"
        >
          <el-form-item class="regTitle">
            <!--Line 18 modified by zf, 2023/5/21-->
            <img src="../../assets/logo.png" class="logo" alt="" />
            <h2>Registered</h2>
          </el-form-item>
          <!--Notify the user need to fill in their email address-->
          <el-form-item label="Email：" prop="email">
            <el-input
              type="text"
              :value="text"
              v-model="message.email"
              readonly
            ></el-input>
          </el-form-item>
          <!--For the development version, the user can choose their identify when registering-->
          <el-form-item label="Choose identity:" prop="identity">
            <el-input
              type="text"
              :value="text"
              v-model="message.identity"
              readonly
            ></el-input>
          </el-form-item>
          <!--Notify the user need to fill in their first name-->
          <el-form-item label="Firstname：" prop="firstname">
            <el-input
              v-model="ruleForm.firstname"
              prefix-icon="el-icon-user-solid"
              placeholder="Please input firstname"
            ></el-input>
          </el-form-item>
          <!--Nofify the user need to fill in their last name-->
          <el-form-item label="Lastname：" prop="lastname">
            <el-input
              v-model="ruleForm.lastname"
              prefix-icon="el-icon-user"
              placeholder="Please input lastname"
            ></el-input>
          </el-form-item>

          <!--Notify the user need to enter their password, and hide the password in the user interface-->
          <el-form-item label="Password：" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              prefix-icon="el-icon-lock"
              placeholder="Please input password"
            ></el-input>
          </el-form-item>
          <!--Notify the user need to double check their password, and hide the password in the user interface-->
          <el-form-item label="Confirm password：" prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              prefix-icon="el-icon-lock"
              placeholder="Please input password again"
              @keyup.enter.native="submitForm()"
            ></el-input>
          </el-form-item>

          <!--The two buttons include 'Submit' and 'Reset' at the bottom of the interface, the first one is the register a new account, the second one is the clear all the info-->
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
  validateFirstname, // These are all used to verify the f_name, l_name, email and password respectively
  validateLastname,
  validatePassword,
  validateCheckPass,
} from "../utils/validate";
export default {
  name: "registered-list",
  data() {
    return {
      message: {
        email: this.$route.query.email,
        identity: this.$route.query.identity,
      },
      verify: true,
      flag: true,
      ruleForm: {
        firstname: "",
        lastname: "",
        password: "",
        checkPass: "",
      },
      rules: {
        firstname: [
          { required: true, validator: validateFirstname, trigger: "blur" },
        ],
        lastname: [
          { required: true, validator: validateLastname, trigger: "blur" },
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" },
        ],
        checkPass: [
          { required: true, validator: validateCheckPass, trigger: "blur" },
        ],
      },
    };
  },
  components: {
    //   vNav,
  },
  methods: {
    submitForm() {
      var checkNull =
        this.ruleForm.firstname !== "" &&
        this.ruleForm.lastname !== "" &&
        this.ruleForm.password !== "" &&
        this.ruleForm.checkPass !== "";
      if (checkNull) {
        if (this.ruleForm.password === this.ruleForm.checkPass) {
          this.$http
            .post("/reg", {
              firstname: this.ruleForm.firstname,
              lastname: this.ruleForm.lastname,
              email: this.message.email,
              password: this.$md5(this.ruleForm.password),
              verify: this.verify,
              identity: this.message.identity,
            })
            .then((res) => {
              if (res.data.flag) {
                this.$message.success(res.data.message);
                this.$router.push('/login');
              } else {
                this.$message.error(res.data.message);
              }
            });
        } else {
          // If the passwords do not match
          this.$message.error("The passwords does not match, please re-enter!");
        }
      } else {
        // If there are still fields left unfilled
        this.$message.error(
          "There are still incomplete items, please complete and submit!"
        );
      }
    },
    resize() {
      (this.ruleForm.firstname = ""),
        (this.ruleForm.lastname = ""),
        (this.ruleForm.password = ""),
        (this.ruleForm.checkPass = "");
    },
  },
};
</script>
  <style scoped>
.reg-content {
  width: 100%;
  height: 100vh;
  background-attachment: fixed; /* 2023/5/21, fixed background board, zf */
}

.box-card {
  /* width: 100% !important; */
  width: 45% !important;
  /* height: 80%; */
  margin: 0 auto;
  position: absolute; /* 2023/5/21, fixed position, zf */
  top: 50%; /* 2023/5/21, 50% from the top, zf */
  left: 50%; /* 2023/5/21, 50% from the left, zf */
  transform: translate(-50%, -50%);
  border-radius: 10px; /* Set the rounded corner size */
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
  font-weight: bold; /* 2023/5/21, zf */
  color: #333; /* 2023/5/21, zf */
  text-align: center; /* 2023/5/21, zf */
  text-transform: uppercase; /* 2023/5/21, zf */
}

.regBtn {
  width: 100%;
  text-align: center;
}

.regBtn > .el-button {
  /* width: 80px; */
  width: 150px; /* 2023/5/21, zf */
  margin: 20px 30px;
}

.registered {
  background-color: hsl(
    213,
    23%,
    38%
  ); /* set the background color, 2023/5/21, zf */
}

.logo {
  height: 80px; /* 2023/5/21, zf */
  width: 80px; /* 2023/5/21, zf */
}
</style>