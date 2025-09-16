<template>
  <div class="registered">
    <el-card class="box-card" shadow="hover">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="createcourse"
        status-icon
        hide-required-asterisk
        class="regForm"
      >
        <el-form-item class="regTitle"><h2>Create Course</h2></el-form-item>
        <el-form-item label="Course Code：" prop="course_code">
          <el-input
            v-model="ruleForm.course_code"
            prefix-icon="el-icon-notebook-1"
            placeholder="Please input Course Code"
          ></el-input>
        </el-form-item>
        <el-form-item label="Course Name：" prop="course_name">
          <el-input
            v-model="ruleForm.course_name"
            prefix-icon="el-icon-user"
            placeholder="Please input Course Name"
          ></el-input>
        </el-form-item>
        <el-form-item label="Course Credit：" prop="course_credit">
          <el-input
            v-model="ruleForm.course_credit"
            prefix-icon="el-icon-coin"
            placeholder="Please input description"
          ></el-input>
        </el-form-item>
        <el-form-item label="Description：" prop="description">
          <el-input
            type="textarea"
            v-model="ruleForm.description"
            prefix-icon="el-icon-chat-line-round"
            placeholder="Please input description"
          ></el-input>
        </el-form-item>
        <div class="regBtn">
          <el-button type="primary" @click="submitForm()">Submit</el-button>
          <el-button @click="resize()">Reset</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

  <script>
import {
  validateCourse_code,
  validateCourse_name,
  validateCourse_credit,
  validateDescription,
} from "../../components/utils/validate";
export default {
  name: "create-course",
  data() {
    return {
      verify: false,
      flag: true,
      ruleForm: {
        course_code: "",
        course_name: "",
        course_credit: "",
        description: "",
      },
      rules: {
        course_code: [
          { required: true, validator: validateCourse_code, trigger: "blur" },
        ],
        course_name: [
          { required: true, validator: validateCourse_name, trigger: "blur" },
        ],
        course_credit: [
          { required: true, validator: validateCourse_credit, trigger: "blur" },
        ],
        description: [
          { required: true, validator: validateDescription, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm() {
      var checkNull =
        this.ruleForm.course_code !== "" &&
        this.ruleForm.course_name !== "" &&
        this.ruleForm.course_credit !== "" &&
        this.ruleForm.description !== "";
      if (checkNull) {
        this.$http
          .post("/createcourse", {
            course_code: this.ruleForm.course_code,
            course_name: this.ruleForm.course_name,
            course_credit: this.ruleForm.course_credit,
            description: this.ruleForm.description,
            tutor: this.$store.getters.user.id,
          })
          .then((res) => {
            if (res.data.flag) {
              this.$message.success(res.data.message);
            } else {
              this.$message.error(res.data.message);
            }
          });
        this.$router.push("/");
      } else {
        this.$message.error("Please complete the form");
      }
    },
    resize() {
      (this.ruleForm.course_code = ""),
        (this.ruleForm.course_name = ""),
        (this.ruleForm.course_credit = ""),
        (this.ruleForm.description = "");
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
  height: 650px;
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