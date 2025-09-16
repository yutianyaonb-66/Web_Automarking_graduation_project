<template>
  <div>
    <div v-if="role === 'tutor'">
      <div class="card-container">
        <el-card class="centered-card">
        <div class="add-ghost">Add Skeleton:</div>
        <el-card class="mb-2" v-if="progressInfos.length">
          <div v-for="(progressInfo, index) in progressInfos" :key="index">
            <span>{{ progressInfo.fileName }}</span>
            <el-progress
              :percentage="progressInfo.percentage"
              :show-text="true"
            ></el-progress>
          </div>
        </el-card>
        <div class="content">
        <el-upload
          class="mb-2"
          action="/your-upload-endpoint"
          :on-change="selectFile"
          :auto-upload="false"
          multiple
        >
          <el-button type="default" icon="el-icon-upload" size="small"
            >Select files</el-button
          >
        </el-upload>
        <el-button
          type="primary"
          :disabled="!selectedFiles"
          @click="uploadFiles"
          size="small"
        >
          Upload
        </el-button>
        <el-alert
          v-if="message"
          class="alert"
          title="upload result"
          type="success"
          :closable="false"
          show-icon
        >
          <ul>
            <li v-for="(ms, i) in message.split('\n')" :key="i">
              {{ ms }}
            </li>
          </ul>
        </el-alert>
        </div>
      </el-card>
      </div>
    </div>
    <div v-if="role === 'student'">
      <el-button
        type="primary"
        icon="el-icon-refresh"
        :disabled="SkeletoncodeContent === ''"
        @click="reload"
      >
        Reload Skelet
      </el-button>
      <span class="button-gap"></span>
      <el-button type="primary" icon="el-icon-download" @click="download">
        Download
      </el-button>
      <el-button type="primary" icon="el-icon-upload2" @click="submit">
        Submit
      </el-button>
      <el-button  type="primary" @click="runCode">Run </el-button>
      <textarea v-model="content" id="editor"></textarea>
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

  
<script>
import * as Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/gfm/gfm.js";
import UploadService from "../../../services/UploadFilesService";
import http from "../../../api";
export default {
  name: "Online-IDE",
  data() {
    return {
      role: "",
      selectedFiles: undefined,
      progressInfos: [],
      message: "",
      fileInfos: [],
      content: "",
      skeleton: "",
      //   courseID:"",
      assignmentID: "",
      assignment: "",
      SkeletoncodeContent: "",
      editor: null,
      output: "",
    };
  },
  async mounted() {
    this.role = this.$store.getters.user.identity;
    await this.fetchAssignment();
    if (this.role == "student") {
      if (this.assignment.skeleton != null) {
        await this.getSkeletoncode();
      }
      this.editor = Codemirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        theme: "dracula",
        mode: "javascript",
      });
      if (this.SkeletoncodeContent) {
        this.editor.setValue(this.SkeletoncodeContent);
      }
    }
  },
  methods: {
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
    getSkeletoncode() {
      // console.log(this.assignment.answer);
      return http
        .get(`/files/content/${this.assignment.skeleton}`)
        .then((response) => {
          this.SkeletoncodeContent = response.data;
          //   console.log(this.SkeletoncodeContent);
          return response.data;
        });
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
      this.$http
        .post("/uploadskeleton", {
          skeleton: this.progressInfos[0].fileName,
          courseID: this.$route.params.id,
        })
        .then(async (res) => {
          if (res.data.flag) {
            this.$message.success(res.data.message);
            await this.fetchAssignment();
            await this.getSkeletoncode();
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
    reload() {
      this.editor.setValue(this.SkeletoncodeContent);
    },

    download() {
      const content = this.editor.getValue();
      //   const filename = "myFile.html"; // 保存的文件名
      const filename = this.assignment.skeleton;

      const blob = new Blob([content], { type: "text/plain" });

      // 创建一个下载链接
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;

      // 模拟点击下载链接，触发文件下载
      link.click();

      // 清理URL对象
      URL.revokeObjectURL(link.href);
    },

    submit() {
      const content = this.editor.getValue();
      const currentDate = new Date();
      const filename = currentDate.getTime() + "_" + this.assignment.skeleton;
      const blob = new Blob([content], { type: "text/plain" });
      const file = new File([blob], filename);
      UploadService.upload(file, (event) => {
        // 处理上传进度
        const progress = Math.round((100 * event.loaded) / event.total);
        console.log(`Upload progress: ${progress}%`);
      })
        .then((response) => {
          // 处理上传成功的响应
          // console.log("Submit success");
          console.log(response);
          // console.log(this.assignmentID);
          // this.$message.success("Submit success");
          this.$http
            .post("/updateFile", {
              assignment: this.assignmentID,
              user: this.$store.getters.user.id,
              file: filename,
            })
            .then((res) => {
              if (res.data.flag) {
                this.$message.success(res.data.message);
                location.reload();
              } else {
                this.$message.error(res.data.message);
              }
            });
        })
        .catch((error) => {
          // 处理上传失败的错误
          console.error("Submit error", error);
        });
      console.log(filename);
      console.log(blob);
    },
    runCode() {
      let result;
      const content = this.editor.getValue();
      try {
        result = eval(content);
      } catch (error) {
        result = error;
      }
      this.output = String(result);
      console.log(this.output);
    },
  },
};
</script>

<style>
.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.progress-card {
  width: 400px;
  margin-bottom: 20px;
  padding: 20px;
}

.progress-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.file-name {
  margin-right: 10px;
}

.progress-bar {
  flex-grow: 1;
}

.upload-section {
  display: flex;
  justify-content: center;
}

.button-gap {
  width: 10px;
  display: inline-block;
}

.card-container {
  display: flex;
  justify-content: center;
}

.centered-card {
  width: 80%;
}

.content {


  align-items: center;
}
</style>