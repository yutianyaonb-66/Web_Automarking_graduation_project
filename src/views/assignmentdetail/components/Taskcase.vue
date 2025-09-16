<template>
  <div>
    <div>
      <div>
        <el-table :data="taskCases" border>
          <div slot="empty" style="text-align: left">
            <el-empty description="Empty" />
          </div>
          <el-table-column prop="name" label="Test case name"></el-table-column>
          <el-table-column prop="testType" label="Test Type"></el-table-column>
          <el-table-column
            prop="returnValue"
            label="Expected Return Value"
          ></el-table-column>
          <el-table-column prop="score" label="Score"></el-table-column>
          <el-table-column
            prop="hidden"
            label="Public/Hidden"
          ></el-table-column>
          <el-table-column label="Operate">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteTask(scope)">
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div style="display: flex; justify-content: center">
      <el-button type="primary" @click="showDialog">Add Task case</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="Add Test case" width="30%">
      <el-form ref="taskForm" :model="task" label-width="120px">
        <el-form-item label="Test case name">
          <el-input v-model="task.name"></el-input>
        </el-form-item>
        <el-form-item label="Score">
          <el-input-number v-model="task.score" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="Test Type">
          <el-select v-model="task.testType" placeholder="Please Choose">
            <el-option label="JavaScript" value="js"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Return Value">
          <el-input v-model="task.returnValue"></el-input>
        </el-form-item>
        <el-form-item label="Public/Hidden">
          <el-select v-model="task.hidden" placeholder="Please Choose">
            <el-option label="Public" value="Public"></el-option>
            <el-option label="Hidden" value="Hidden"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">Cancel</el-button>
        <el-button type="primary" @click="addTask">Okk</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
export default {
  name: "task-case",
  data() {
    return {
      dialogVisible: false,
      task: {
        name: "",
        score: 0,
        returnValue: "",
        testType: "",
        hidden: "",
      },
      taskCases: [],
    };
  },
  mounted() {
    this.getTaskcase();
  },
  methods: {
    getTaskcase() {
      if (this.$store.getters.user.identity == "tutor") {
        this.$http
          .post("/gateTaskcase", {
            assignment: this.$route.params.id,
          })
          .then((res) => {
            if (res.data.flag) {
              this.$message.success(res.data.message);
              this.taskCases = res.data.tastcases;
            } else {
              this.$message.error(res.data.message);
            }
          });
      }
    },
    showDialog() {
      this.dialogVisible = true;
    },
    cancelDialog() {
      this.dialogVisible = false;
      this.resetForm();
    },
    addTask() {
      var checkNull =
        this.task.name !== "" &&
        this.task.score !== "" &&
        this.task.returnValue !== "" &&
        this.task.testType !== "" &&
        this.task.hidden !== "";
      if (checkNull) {
        this.$http
          .post("/createTaskcase", {
            name: this.task.name,
            assignment: this.$route.params.id,
            testType: this.task.testType,
            returnValue: this.task.returnValue,
            score: this.task.score,
            hidden: this.task.hidden,
          })
          .then((res) => {
            if (res.data.flag) {
              this.$message.success(res.data.message);
              this.getTaskcase();
              this.dialogVisible = false;
              this.resetForm();
              location.reload();
            } else {
              this.$message.error(res.data.message);
            }
          });
      } else {
        this.$message.error("Please check that the form is complete.");
      }
    },
    resetForm() {
      this.$refs.taskForm.resetFields();
      this.task = {
        name: "",
        score: 0,
        returnValue: "",
        testType: "",
      };
    },
    deleteTask(index) {
      //   this.taskCases.splice(index, 1);
      console.log(index.row._id);
      this.$http
        .post("/deleteTaskcase", {
          taskcaseID: index.row._id,
        })
        .then((res) => {
          if (res.data.flag) {
            this.$message.success(res.data.message);
            this.getTaskcase();
          }
        });
    },
  },
};
</script>