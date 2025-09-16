<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="createcourse"
        status-icon
        hide-required-asterisk
        class="regForm"
      >
        <el-form-item class="regTitle"><h1>Create Assignment</h1></el-form-item>
        <el-form-item label="Assignment Name：" prop="name">
          <el-input
            v-model="ruleForm.name"
            prefix-icon="el-icon-user-solid"
            placeholder="Please input Assignment name"
          ></el-input>
        </el-form-item>
        <el-form-item label="Start Date:" prop="start_date">
          <el-col :span="11">
            <el-date-picker
              type="date"
              format="dd-MM-yyyy"
              placeholder="Start Date"
              :picker-options="startPickerOptions"
              @change="validateEndDate"
              v-model="ruleForm.start_date"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="End Date：" prop="end_date">
          <el-col :span="11">
            <el-date-picker
              type="date"
              format="dd-MM-yyyy"
              placeholder="Due date"
              :picker-options="endPickerOptions"
              v-model="ruleForm.end_date"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="Description：" prop="description">
          <el-input
            type="textarea"
            v-model="ruleForm.description"
            prefix-icon="el-icon-message"
            placeholder="Please input description"
          ></el-input>
          <label>Score:</label>
          <el-table :data="ruleForm.score" style="width: 100%">
            <el-table-column label="Criteria" prop="criteria">
              <template slot-scope="{ row }">
                <el-input v-model="row.criteria"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Ratings" prop="ratings">
              <template slot-scope="{ row }">
                <el-input v-model="row.ratings"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Pts" prop="pts">
              <template slot-scope="{ row }">
                <el-input-number v-model="row.pts" :min="0"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="Option">
              <template slot-scope="{ row }">
                <el-button type="danger" @click="removeItem(row)"
                  >Delete</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <span style="font-weight: bold">Total Pts:</span>
            {{ getTotalPts() }}
          </div>
          <div class="centered-button">
            <el-tooltip
              class="item"
              effect="dark"
              content="Add one Criteria"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="el-icon-circle-plus"
                @click="addItem"
                circle
              ></el-button>
            </el-tooltip>
          </div>
        </el-form-item>
      </el-form>
      <el-divider content-position="left">Submit Standard Answer</el-divider>
      <el-card class="mb-2" v-if="progressInfos.length">
        <div v-for="(progressInfo, index) in progressInfos" :key="index">
          <span>{{ progressInfo.fileName }}</span>
          <el-progress
            :percentage="progressInfo.percentage"
            :show-text="true"
          ></el-progress>
        </div>
      </el-card>

      <div class="button-container">
        <el-upload
          class="mb-2"
          action="/your-upload-endpoint"
          :on-change="selectFile"
          :auto-upload="false"
          multiple
        >
          <el-button type="default" icon="el-icon-upload" size="small">
            Select files
          </el-button>
        </el-upload>

        <el-button
          type="success"
          :disabled="!selectedFiles"
          @click="uploadFiles"
          size="small"
        >
          Upload
        </el-button>

        <div v-if="message" class="alert alert-light" role="alert">
          <ul>
            <li v-for="(ms, i) in message.split('\n')" :key="i">
              <!-- {{ ms }} -->
            </li>
          </ul>
        </div>

        <el-button
          :disabled="progressInfos.length === 0"
          type="primary"
          @click="submitForm()"
        >
          Submit
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
import UploadService from "../../services/UploadFilesService";
import {
  validateCourse_name,
  validateDescription,
  validateScore,
} from "../../components/utils/validate";
export default {
  name: "upload-files",
  data() {
    const today = new Date();
    return {
      selectedFiles: undefined,
      progressInfos: [],
      message: "",
      fileInfos: [],
      verify: false,
      flag: true,
      totalPts: 0,
      ruleForm: {
        name: "",
        start_date: today,
        end_date: today,
        description: "",
        score: [{ criteria: "", ratings: "", pts: 0 }],
      },
      startPickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      endPickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < this.ruleForm.start_date.getTime();
        },
      },
      rules: {
        name: [
          { required: true, validator: validateCourse_name, trigger: "blur" },
        ],
        start_date: [
          { required: true, validator: validateCourse_name, trigger: "blur" },
        ],
        end_date: [
          { required: true, validator: validateCourse_name, trigger: "blur" },
        ],
        score: [{ required: true, validator: validateScore, trigger: "blur" }],
        description: [
          { required: true, validator: validateDescription, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    addItem() {
      this.ruleForm.score.push({ criteria: "", ratings: "", pts: 0 });
    },
    removeItem(index) {
      this.ruleForm.score.splice(index, 1);
    },
    validateEndDate() {
      if (this.ruleForm.end_date < this.ruleForm.start_date) {
        this.ruleForm.end_date = this.ruleForm.start_date;
      }
    },
    selectFile() {
      this.progressInfos = [];
      this.selectedFiles = event.target.files;
    },
    uploadFiles() {
      this.message = "";
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    },
    upload(idx, file) {
      this.progressInfos[idx] = { percentage: 0, fileName: file.name };
      UploadService.upload(file, (event) => {
        this.progressInfos[idx].percentage = Math.round(
          (100 * event.loaded) / event.total
        );
      })
        .then((response) => {
          let prevMessage = this.message ? this.message + "\n" : "";
          this.message = prevMessage + response.data.message;
          return UploadService.getFiles();
        })
        .then((files) => {
          this.fileInfos = files.data;
        })
        .catch(() => {
          this.progressInfos[idx].percentage = 0;
          this.message = "Could not upload the file:" + file.name;
        });
    },
    submitForm() {
      var checkNull =
        this.ruleForm.name !== "" &&
        this.ruleForm.start_date !== "" &&
        this.ruleForm.end_date !== "" &&
        this.ruleForm.description !== "";
      // console.log(this.progressInfos[0].fileName);
      // console.log(this.ruleForm.name);
      console.log(this.totalPts);
      if (checkNull) {
        this.$http
          .post("/createassignment", {
            name: this.ruleForm.name,
            description: this.ruleForm.description,
            start_date: moment(this.ruleForm.start_date).format("YYYY-MM-DD"),
            end_date: moment(this.ruleForm.end_date).format("YYYY-MM-DD"),
            score: this.ruleForm.score,
            answer: this.progressInfos[0].fileName,
            courseID: localStorage.getItem("item_id"),
            totleScore: this.totalPts,
          })
          .then((res) => {
            if (res.data.flag) {
              this.$message.success(res.data.message);
            } else {
              this.$message.error(res.data.message);
            }
          });
        this.$router.push("/showassignment");
      } else {
        this.$message.error("Please complete the form");
      }
    },
    getTotalPts() {
      this.totalPts = this.ruleForm.score.reduce(
        (acc, cur) => acc + cur.pts,
        0
      );
      // console.log( this.totalPts);
      return this.ruleForm.score.reduce((acc, cur) => acc + cur.pts, 0);
    },
  },
  mounted() {
    UploadService.getFiles().then((response) => {
      this.fileInfos = response.data;
    });
  },
  // computed: {
  //   getTotalPts() {
  //     return this.ruleForm.score.reduce((acc, cur) => acc + cur.pts, 0);
  //   },
  // },
};
</script>

<style scoped>
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

.centered-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.button-container > * {
  margin: 0;
}
</style>