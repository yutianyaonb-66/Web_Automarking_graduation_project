<template>
  <div><el-table :data="tableData" border style="width: 100%">
    <div slot="empty" style="text-align: left;">
      <el-empty description="Empty"/>
    </div>
    <el-table-column fixed prop="course_code" label="Course Code">
    </el-table-column>
    <el-table-column prop="course_name" label="Course Name"> </el-table-column>
    <el-table-column prop="firstname" label="firstname"> </el-table-column>
    <el-table-column prop="lastname" label="lastname"> </el-table-column>
    <el-table-column fixed="right" label="Option">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row, true)" type="success" icon="el-icon-check" circle></el-button>
        <el-button @click="handleClick(scope.row, false)" type="danger" icon="el-icon-delete" circle></el-button>
      </template>
    </el-table-column>
  </el-table>
  
  </div>
</template>
  
<script>
export default {
  name: "user-list",
  methods: {
    handleClick(row, value) {
      // console.log(`行 ${row._id} 的状态更改为 ${value}`);
      this.$http
        .post("/studentaudit", {
          id: row._id,
          state: value,
        })
        .then((res) => {
          if (res.data.flag) {
            this.$message.success(res.data.message);
          } else {
            this.$message.error(res.data.message);
          }
        });
      this.$http.post("unapprovestudent").then((res) => {
        if (res.data.flag) {
          console.log(res.data.course);
          this.tableData = res.data.course;
        } else {
          console.log(res.data.message);
        }
      });
    },
  },

  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.$http.post("unapprovestudent").then((res) => {
      if (res.data.flag) {
        console.log(res.data.course);
        this.tableData = res.data.course;
      } else {
        console.log(res.data.message);
      }
    });
  },
};
</script>