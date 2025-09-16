<template>
  <div>
    <el-input v-model="search" size="middle" placeholder="Course Code Search" />
    <el-table
      :data="
        tableData.filter(
          (data) =>
            !search ||
            data.course_code.toLowerCase().includes(search.toLowerCase())
        )
      "
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
    >
      <div slot="empty" style="text-align: left">
        <el-empty description="Empty" />
      </div>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="Description:">
              <span>{{ props.row.description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="Course Code" prop="course_code">
      </el-table-column>
      <el-table-column label="Course Name" prop="course_name">
      </el-table-column>
      <el-table-column label="Course Credit" prop="course_credit">
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px; display: flex; justify-content: center">
      <el-button @click="setCurrent">Confirm Enroll</el-button>
    </div>
  </div>
</template>
  
  <style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
  
  <script>
export default {
  data() {
    return {
      tableData: [],
      selection: [],
      currentRow: null,
      search: "",
    };
  },
  mounted() {
    this.$http.post("approvedcourse").then((res) => {
      if (res.data.flag) {
        this.tableData = res.data.course;
      } else {
        console.log(res.data.message);
      }
    });
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    setCurrent() {
      console.log(this.currentRow);
      console.log(this.$store.getters.user);
      if (this.currentRow) {
        this.$http
          .post("/enrollcourse", {
            courseid: this.currentRow._id,
            studentid: this.$store.getters.user.id,
            lastname: this.$store.getters.user.lastname,
            firstname: this.$store.getters.user.firstname,
            course_code: this.currentRow.course_code,
            course_name: this.currentRow.course_name,
          })
          .then((res) => {
            if (res.data.flag) {
              this.$message.success(res.data.message);
            } else {
              this.$message.error(res.data.message);
            }
          });
      } else {
        this.$message.error("Please select a course");
      }
    },
  },
};
</script>
  