<template>
  <div>
    <h1 class="page-title">Marks for {{ firstName }} {{ lastName }}</h1>
    <div class="table-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        class="custom-table"
        @row-click="showDrawer"
      >
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column label="Due">
          <template slot-scope="scope">
            {{ formatDate(scope.row.end_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="submissions.grade" label="Score">
          <template slot-scope="scope">
            {{ scope.row.submissions.grade }} / {{ scope.row.totleScore }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      :visible.sync="drawerVisible"
      title="Feedback"
      :width="400"
      placement="right"
    >
      <div v-if="selectedRow">
        <p class="submission-date">
          {{ formatDate(selectedRow.submissions.submissionDate) }}
        </p>
        <el-card class="box-card">
          <div>
            <p class="comment">
              Comment: {{ selectedRow.submissions.comments }}
            </p>
          </div>
        </el-card>
        <el-card>
          <div id="chart" style="width: 100%; height: 400px"></div>
          <p>Average: {{ average.toFixed(2) }}</p>
          <p>Highest score: {{ maxScore }}</p>
          <p>Lowest score: {{ minScore }}</p>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>

<script>
// import echarts from "echarts";
// import "echarts/dist/echarts.min.css";
import * as echarts from "echarts";
import moment from "moment";
// import $ from "jquery";
export default {
  name: "Assignment-Marks",
  data() {
    return {
      firstName: null,
      lastName: null,
      courseID: "",
      tableData: [],
      drawerVisible: false,
      selectedRow: null,
      scoreList: [],
      chart: "",
      result: "",
    };
  },
  mounted() {
    this.firstName = this.$store.getters.user.firstname;
    this.lastName = this.$store.getters.user.lastname;
    this.getMarksInfo();
  },
  methods: {
    getMarksInfo() {
      this.courseID = localStorage.getItem("item_id");
      this.$http
        .post("/getMarksInfo", {
          courseID: this.courseID,
          userID: this.$store.getters.user.id,
        })
        .then((res) => {
          if (res.data.flag) {
            this.tableData = res.data.result;
            console.log(this.tableData);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    showDrawer(row) {
      this.drawerVisible = true;
      this.selectedRow = row;
      // console.log(row.submissions.assignment);
      this.$http
        .post("/getResultTable", {
          assignmentID: row.submissions.assignment,
        })
        .then((res) => {
          if (res.data.flag) {
            this.scoreList = res.data.score;
            this.scoreList.sort((a, b) => a - b);
            const scoreCounts = {};
            this.scoreList.forEach((score) => {
              if (scoreCounts[score]) {
                scoreCounts[score]++;
              } else {
                scoreCounts[score] = 1;
              }
            });

            const scores = Object.keys(scoreCounts);
            const counts = Object.values(scoreCounts);

            this.chart = echarts.init(document.getElementById("chart"));
            const option = {
              title: {
                text: "Student Score Histogram",
              },
              xAxis: {
                data: scores,
              },
              yAxis: {},
              series: [
                {
                  type: "bar",
                  data: counts,
                },
              ],
            };
            this.chart.setOption(option);
          }
        });
    },
    formatDate(date) {
      return moment.utc(date).format("DD MMM YYYY");
    },
  },
  computed: {
    average() {
      if (this.scoreList.length === 0) {
        return 0
      }

      const sum = this.scoreList.reduce((acc, score) => acc + score, 0)
      return sum / this.scoreList.length
    },
    maxScore() {
      if (this.scoreList.length === 0) {
        return 0
      }

      return Math.max(...this.scoreList)
    },
    minScore() {
      if (this.scoreList.length === 0) {
        return 0
      }

      return Math.min(...this.scoreList)
    }
  }
};
</script>

<style scoped>
.page-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 20px;
}

.custom-table {
  /* 添加自定义表格样式 */
  border-collapse: collapse;
  width: 100%;
}

.custom-table th {
  /* 表头样式 */
  background-color: #f5f5f5;
  font-weight: bold;
  padding: 10px;
  text-align: left;
}

.custom-table td {
  /* 表格单元格样式 */
  padding: 10px;
}

.custom-table tr:nth-child(even) {
  /* 隔行变色 */
  background-color: #f9f9f9;
}

.custom-table tr:hover {
  /* 鼠标悬停样式 */
  background-color: #ebebeb;
}
.submission-date {
  font-size: 18px;
  margin-bottom: 10px;
}

.comment {
  font-size: 16px;
}
</style>