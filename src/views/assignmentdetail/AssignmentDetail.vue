<template>
  <div class="assignment-detail">
    <div class="header">
      <h1 class="title">{{ assignment.name }}</h1>
      <div class="score">{{ assignment.totleScore }} Possible Points</div>
    </div>
    <div class="content">
      <div class="due-date">
        Due Date: {{ formatDate(assignment.end_date) }}
      </div>
      <div class="status">
        <el-steps :active="activeStep" finish-status="success">
          <el-step title="IN PROGRESS"></el-step>
          <el-step title="SUBMITTED"></el-step>
          <el-step title="REVIEW FEEDBACK"></el-step>
        </el-steps>
      </div>
    </div>
    <el-divider></el-divider>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="Assignment Detail" name="first">
        <div>
          <span @click="isShowDetail = !isShowDetail" style="color: black; cursor: pointer">
            {{ isShowDetail ? "> Hide Detail" : "> Show Detail" }}
          </span>
          <el-collapse-transition>
            <div v-show="isShowDetail">
              <el-card>
                <p>{{ assignment.description }}</p>
              </el-card>
            </div>
          </el-collapse-transition>
        </div>
        <el-divider><i class="el-icon-loading"></i></el-divider>
        <div v-if="role === 'student'">
          <div>
            <span @click="isShowStudentMergely = !isShowStudentMergely" style="color: black; cursor: pointer">
              {{ isShowStudentMergely ? "> Hide Result" : "> Show Result" }}
            </span>
            <el-collapse-transition>
              <div v-show="isShowStudentMergely">
                <div v-if="activeStep !== 1">
                  <span>(Assignments Uploaded Above: {{ uploadfilename }})</span>
                  <el-button type="primary" @click="downloadFile">DownLoad</el-button>
                  <el-button :disabled="isDisabled" @click="generatePDF" type="primary">Compare Results Download as
                    PDF</el-button>
                  <el-card>
                    <pre>
                <p>{{ this.diffResult }}</p>
                    </pre>
                  </el-card>
                  <el-card>
                    <div id="mergely" style="opacity: 0"></div>
                    <!-- <div id="mergely"></div> -->
                  </el-card>
                </div>
              </div>
            </el-collapse-transition>
          </div>

          <el-row class="fixed-bar">
            <div v-if="progressInfos">
              <div class="mb-2" v-for="(progressInfo, index) in progressInfos" :key="index">
                <span>{{ progressInfo.fileName }}</span>
                <div class="progress">
                  <div class="progress-bar progress-bar-info" role="progressbar" :aria-valuenow="progressInfo.percentage"
                    aria-valuemin="0" aria-valuemax="100" :style="{ width: progressInfo.percentage + '%' }">
                    {{ progressInfo.percentage }}%
                  </div>
                </div>
              </div>
            </div>
            <!-- <label class="btn btn-primary"> -->
            <!-- <input type="file" multiple @change="selectFile" />
            </label>
            <button
              class="btn btn-success"
              :disabled="!selectedFiles"
              @click="uploadFiles"
            >
              Upload
            </button> -->
            <div class="button-container">
              <el-upload class="mb-2" action="/your-upload-endpoint" :on-change="selectFile" :auto-upload="false"
                multiple>
                <el-button type="default" icon="el-icon-upload" size="small">Select files</el-button>
              </el-upload>

              <el-button type="success" :disabled="!selectedFiles" @click="uploadFiles" size="small">
                Upload
              </el-button>
            </div>
            <div v-if="message" class="alert alert-light" role="alert">
              <ul>
                <li v-for="(ms, i) in message.split('\n')" :key="i">
                  {{ ms }}
                </li>
              </ul>
            </div>
          </el-row>
        </div>
        <div v-if="role === 'tutor'">
          <span @click="isShowAssignment = !isShowAssignment" style="color: black; cursor: pointer">{{
            isShowAssignment ? "> Hide Assignment" : "> Show Assignment"
          }}</span>
          <el-collapse-transition>
            <div v-show="isShowAssignment">
              <el-card>
                <el-select v-model="selected" placeholder="Please select a student" @change="handleSelectChange">
                  <el-option v-for="student in StudentLists" :key="student._id"
                    :label="`${student.firstname} ${student.lastname}`" :value="student._id">
                  </el-option>
                </el-select>
                <el-button :disabled="isDisabled" @click="generatePDF" type="primary">Compare Results Download as
                  PDF</el-button>
                <div id="mergely"></div>
                <div v-if="StudentcodeContent !== ''">
                  <el-card>
                    <pre>
                <p>{{ this.diffResult }}</p>
              </pre>
                  </el-card>
                </div>
              </el-card>
            </div>
          </el-collapse-transition>
        </div>
        <el-divider><i class="el-icon-loading"></i></el-divider>
        <div>
          <span @click="isShowTastCase = !isShowTastCase" style="color: black; cursor: pointer">
            {{ isShowTastCase ? "> Hide Test Case" : "> Show Test Case" }}
          </span>
          <el-collapse-transition>
            <div v-show="isShowTastCase" v-if="StudentcodeContent !== ''">
              <el-card>
                <div>
                  <h2>Public test case</h2>
                  <el-table :data="publicTaskCases" border>
                    <div slot="empty" style="text-align: left;">
                      <el-empty description="Empty" />
                    </div>
                    <el-table-column label="Status">
                      <template slot-scope="scope">
                        <i v-if="scope.row.status" class="el-icon-check" style="color: green"></i>
                        <i v-else class="el-icon-close" style="color: red"></i>
                      </template>
                    </el-table-column>
                    <el-table-column prop="name" label="Test name"></el-table-column>
                    <el-table-column prop="returnValue" label="Expected Return Value"></el-table-column>
                    <el-table-column prop="score" label="Score">
                      <template slot-scope="scope">
                        <span v-if="scope.row.status">{{ scope.row.score }}/{{ scope.row.score }}</span>
                        <span v-else>0/{{ scope.row.score }}</span>
                      </template>
                    </el-table-column>
                  </el-table>

                  <h2>Hidden tast case</h2>
                  <el-table :data="hiddenTaskCases" border>
                    <div slot="empty" style="text-align: left;">
                      <el-empty description="Empty" />
                    </div>
                    <el-table-column label="Status">
                      <template slot-scope="scope">
                        <i v-if="scope.row.status" class="el-icon-check" style="color: green"></i>
                        <i v-else class="el-icon-close" style="color: red"></i>
                      </template>
                    </el-table-column>
                    <el-table-column prop="name" label="Task Name"></el-table-column>
                    <el-table-column prop="score" label="Score">
                      <template slot-scope="scope">
                        <span v-if="scope.row.status">{{ scope.row.score }}/{{ scope.row.score }}</span>
                        <span v-else>0/{{ scope.row.score }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-card>
            </div>
          </el-collapse-transition>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Grade" name="second" :disabled="StudentcodeContent === ''" v-if="role === 'tutor'">
        <div></div>
        <p>
          Grading {{ selectedStudentDetail.firstname }}
          {{ selectedStudentDetail.lastname }}'s Assignment
        </p>
        <el-collapse-transition>
          <el-card>
            <el-table :data="assignment.score" style="width: 100%">
              <el-table-column prop="criteria" label="Criteria"></el-table-column>
              <el-table-column prop="ratings" label="Ratings"></el-table-column>
              <el-table-column label="PTS">
                <template slot-scope="scope">
                  <div style="display: flex; align-items: center">
                    <el-input-number v-model="scope.row.editedPts" :min="0" :max="scope.row.pts"
                      @change="handlePtsChange(scope.row)"></el-input-number>
                    /
                    <div style="margin-right: 10px">
                      {{ scope.row.pts }}
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: right; margin-top: 10px">
              Total Scores: {{ totalScore }}
            </div>
          </el-card>
        </el-collapse-transition>
        <el-collapse-transition>
          <el-card>
            <p>Comments</p>
            <el-input type="textarea" v-model="comments" ></el-input>
          </el-card>
        </el-collapse-transition>
        <div style="display: flex; justify-content: center; align-items: center">
          <el-button type="primary" @click="submitGrade()">Submit</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Online IDE" name="third">
        <OnlineIDE />
      </el-tab-pane>
      <el-tab-pane label="Test Case" name="fourth" v-if="role === 'tutor'">
        <Taskcase />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
  
<script>
import OnlineIDE from "./components/OnlineIDE.vue";
import Taskcase from "./components/Taskcase.vue";
import UploadService from "../../services/UploadFilesService";
import http from "../../api";
import $ from "jquery";
import "codemirror/lib/codemirror.js";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/search/searchcursor.js";
import "mergely/lib/mergely.js";
import "mergely/lib/mergely.css";
import jsPDF from "jspdf";

export default {
  name: "Assignment-Detail",
  components: {
    OnlineIDE,
    Taskcase,
  },
  data() {
    return {
      activeName: "first",
      role: "",
      assignment: "",
      assignmentID: "",
      activeStep: 1,
      isShowDetail: true,
      isShowStudentMergely: false,
      isShowAssignment: true,
      isShowGrade: true,
      isShowTastCase: true,
      ifsubmitsubmissionsID: "",

      selectedFiles: undefined,
      progressInfos: [],
      message: "",
      fileInfos: [],
      uploadfilename: "",
      StudentcodeContent: "",
      TutorcodeContent: "",

      StudentLists: [],
      selected: "",
      mergelyInstance: null,
      diffResult: "",

      totalScore: 0,
      selectedStudentDetail: "",
      selectedSubmissionsID: "",
      comments: "",
      currentTime: "",

      publicTaskCases: [],
      hiddenTaskCases: [],
    };
  },
  async mounted() {
    await this.fetchAssignment();
    this.role = this.$store.getters.user.identity;
    if (this.role === "student") {
      await this.checkassignment();
      if (this.activeStep !== 1) {
        this.roleStudentGetCodeContent();
        await this.getTutorcode();
        this.$nextTick(() => {
          this.renderMergely();
        });
        this.tastcase();
      }
      this.calculateTotalScore();
    } else {
      await this.checkassignment();
      await this.getTutorcode();
      this.getAllStudentNameSubmited();
      this.$nextTick(() => {
        this.renderMergely();
      });
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
    },
    beforeRemove(file) {
      return this.$confirm(`Cancel the transfert of ${file.name} ?`);
    },
    changeDiff(str) {
      const lines = str.split('\n')
      const arr = []
      for (let i = 0; i < lines.length; i++) {
        if (/^\d/.test(lines[i]) === true) {
          let array = []
          array.push(lines[i])
          while (i + 1 < lines.length && /^\d/.test(lines[i + 1]) === false) {
            array.push(lines[i + 1])
            i++
          }
          arr.push(array)
        }
      }

      for (let i = 0; i < arr.length; i++) {
        let letter = arr[i][0].match(/[a-z]/)[0]
        switch (letter) {
          case "a":
            arr[i][0] = "missing line(s):"
            for (let j = 1; j < arr[i].length; j++) {
              let index = arr[i][j].search(/[a-zA-Z]/);
              if (index != -1)
                arr[i][j] = arr[i][j].slice(index - 1)
            }
            break
          case "c":
            arr[i][0] = "wrong line(s):"
            for (let j = 1; j < arr[i].length; j++) {
              if (arr[i][j] === "---") {
                arr[i][j] = "should be"
              } else {

                let index = arr[i][j].search(/[a-zA-Z]/);
                if (index != -1)
                  arr[i][j] = arr[i][j].slice(index - 1)
              }
            }
            break
          case "d":
            arr[i][0] = "unnecessary line(s):"
            for (let j = 1; j < arr[i].length; j++) {
              let index = arr[i][j].search(/[a-zA-Z]/);
              if (index != -1)
                arr[i][j] = arr[i][j].slice(index - 1)
            }
            break
        }

      }
      // return arr
      let result = ""
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          result = result + arr[i][j] + "\n"
          if (j === arr[i].length - 1)
            result = result + "\n"
        }
      }
      return result
    },
    renderMergely() {
      this.mergelyInstance = $("#mergely");
      this.mergelyInstance.mergely({
        lhs: (setValue) => {
          setValue(this.StudentcodeContent);
        },
        rhs: (setValue) => {
          setValue(this.TutorcodeContent);
        },
        wrap_lines: true,
        ignorews:true,
        height: "200px",
        autoresize: true,
      });
      // let middle=$("#mergely").mergely("diff")
      this.diffResult = this.$options.methods.changeDiff($("#mergely").mergely("diff"));
      this.$watch("StudentcodeContent", () => {
        if (this.mergelyInstance) {
          var value = this.mergelyInstance.mergely("get", "lhs");
          // console.log(value);
          if (value !== this.StudentcodeContent) {
            this.mergelyInstance.mergely("lhs", this.StudentcodeContent);
          }
          this.diffResult = this.$options.methods.changeDiff($("#mergely").mergely("diff"));
          // console.log(this.diffResult);
        }
      });
    },
    getTutorcode() {
      // console.log(this.assignment.answer);
      return http
        .get(`/files/content/${this.assignment.answer}`)
        .then((response) => {
          this.TutorcodeContent = response.data;
          // console.log(this.TutorcodeContent);
          return response.data;
        });
    },
    handleSelectChange(selectedStudent) {
      // console.log(selectedStudent); // 输出用户选择的学生对象
      this.$http
        .post("getStudentSubmitContent", {
          studentID: selectedStudent,
          assignmentID: this.assignmentID,
        })
        .then((res) => {
          if (res.data.flag) {
            this.selectedStudentDetail = res.data.studentDetail[0];
            this.selectedSubmissionsID = res.data.submitID;
            http.get(`/files/content/${res.data.filename}`).then((response) => {
              this.StudentcodeContent = response.data;
              // console.log(this.StudentcodeContent);
              // console.log(this.selectedStudentDetail.lastname);
              // console.log(this.selectedSubmissionsID);
              this.tastcase();
            });
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getAllStudentNameSubmited() {
      this.$http
        .post("getAllStudentNameSubmited", {
          assignmentID: this.assignmentID,
        })
        .then((res) => {
          if (res.data.flag) {
            this.StudentLists = res.data.StudentLists.flat();
            // console.log(this.StudentLists);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    checkassignment() {
      return new Promise((resolve, reject) => {
        this.$http
          .post("checkassignment", {
            assignmentID: this.assignmentID,
            user: this.$store.getters.user.id,
            role: this.$store.getters.user.identity,
          })
          .then((res) => {
            if (res.data.flag) {
              this.activeStep = res.data.submissionInfo.result;
              this.ifsubmitsubmissionsID =
                res.data.submissionInfo.submissionsID;
              this.uploadfilename = res.data.submissionInfo.submissionsFile;

              resolve();
            } else {
              reject(new Error("check assignment failed"));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    roleStudentGetCodeContent() {
      http
        .get(`/files/content/${this.uploadfilename}`)
        .then((response) => {
          this.StudentcodeContent = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchAssignment() {
      return new Promise((resolve, reject) => {
        this.assignmentID = this.$route.params.id;
        this.$http
          .post("getassignmentdetail", { assignmentID: this.assignmentID })
          .then((res) => {
            if (res.data.flag) {
              this.assignment = res.data.assignment;
              resolve(); // 成功时调用 resolve
            } else {
              this.$message.error(res.data.message);
              reject(); // 失败时调用 reject
            }
          })
          .catch((error) => {
            error("Failed to fetch assignment.");
            reject(); // 异常时调用 reject
          });
      });
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("en-US", options);
    },
    selectFile() {
      this.progressInfos = [];
      this.selectedFiles = event.target.files;
      console.log(this.selectedFiles)
    },
    uploadFiles() {
      // console.log(this.activeStep);
      this.message = "";
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
      this.$http
        .post("/submitassignment", {
          user: this.$store.getters.user.id,
          assignment: this.assignmentID,
          file: this.progressInfos[0].fileName,
          activeStep: this.activeStep,
          ifsubmitsubmissionsID: this.ifsubmitsubmissionsID,
        })
        .then(async (res) => {
          if (res.data.flag) {
            console.log(res.data.message);
            await this.checkassignment();
            if (this.activeStep !== 0) {
              this.roleStudentGetCodeContent();
            }
            await this.getTutorcode();
            this.$nextTick(() => {
              this.renderMergely();
            });
          } else {
            this.$message.error(res.data.message);
          }
        });
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
    downloadFile() {
      const url = "files/" + this.uploadfilename;
      http.get(url, { responseType: "blob" }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", this.uploadfilename);
        document.body.appendChild(link);
        link.click();
      });
    },
    generatePDF() {
      const doc = new jsPDF();
      doc.text(this.diffResult, 10, 10);
      const blob = doc.output("blob");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Different_Result.pdf";
      link.click();
    },
    calculateTotalScore() {
      let total = 0;
      this.assignment.score.forEach((score) => {
        total += score.editedPts;
      });
      this.totalScore = total;
      console.log(this.totalScore);
    },
    handlePtsChange(row) {
      row.editedPts = Math.min(Math.max(row.editedPts, 0), row.pts);
      this.calculateTotalScore();
    },
    submitGrade() {
      var checkNull =
        this.comments !== "" && typeof this.totalScore === "number";
      if (checkNull) {
        this.$http
          .post("/submitGrade", {
            submitID: this.selectedSubmissionsID,
            grade: this.totalScore,
            markDate: this.currentTime,
            comments: this.comments,
            commenter: this.$store.getters.user.id,
            assignment: this.assignmentID,
          })
          .then((res) => {
            if (res.data.flag) {
              this.$message.success(res.data.message);
              window.history.back();
            }
          });
      }
    },
    tastcase() {
      let result;
      try {
        result = eval(this.StudentcodeContent);
      } catch (error) {
        result = error;
      }
      let output = String(result);
      console.log(output);
      this.$http
        .post("/gateTaskcase", {
          assignment: this.$route.params.id,
        })
        .then((res) => {
          if (res.data.flag) {
            this.publicTaskCases = res.data.publiccases;
            this.hiddenTaskCases = res.data.hiddencases;
            if (this.publicTaskCases) {
              for (let i = 0; i < this.publicTaskCases.length; i++) {
                if (output == this.publicTaskCases[i].returnValue) {
                  this.publicTaskCases[i].status = true;
                } else {
                  this.publicTaskCases[i].status = false;
                  //  console.log(this.publicTaskCases[i].returnValue);
                }
              }
            }
            if (this.hiddenTaskCases) {
              for (let i = 0; i < this.hiddenTaskCases.length; i++) {
                if (output == this.hiddenTaskCases[i].returnValue) {
                  this.hiddenTaskCases[i].status = true;
                } else {
                  this.hiddenTaskCases[i].status = false;
                }
              }
            }
            console.log(this.publicTaskCases);
          }
        });
    },



  },
  computed: {
    isDisabled() {
      return !this.StudentcodeContent;
    },
  },
  created() {
    const now = new Date();
    this.currentTime = now.toLocaleString(); // 转换为本地时间格式字符串
  },
};
</script>

<style scoped>
.assignment-detail {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 2.5rem;
  margin: 0;
}

.score {
  font-size: 2rem;
}

.content {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.due-date {
  font-size: 1.5rem;
  margin-right: 40px;
}

.status {
  flex: 1;
}

.fixed-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  z-index: 999;
}

.fixed-bar .el-col {
  display: flex;
  justify-content: flex-end;
}

.button-container {
  display: flex;
}

.button-container button {
  margin-right: 10px;
}
</style>