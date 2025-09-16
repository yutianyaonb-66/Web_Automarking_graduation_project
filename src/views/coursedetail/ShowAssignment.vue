<template>
  <div>
    <el-collapse>
      <el-collapse-item title="Upcoming Assignments">
        <el-card
          class="card"
          v-for="(assignment, index) in upcomingAssignments"
          :key="index"
        >
          <div slot="header" class="card-header">
            <i class="el-icon-date icon"></i>
            <router-link
              :to="{ name: 'assignmentdetail', params: { id: assignment._id } }"
            >
              <span class="title">{{ assignment.name }}</span>
            </router-link>
            <div class="buttons">
              <el-button
                v-if="hasTutorPermissions"
                type="text"
                icon="el-icon-edit"
                @click="editAssignment(assignment)"
                >Edit</el-button
              >
              <el-button
                v-if="hasTutorPermissions"
                type="text"
                icon="el-icon-delete"
                @click="deleteAssignment(assignment)"
                >Delete</el-button
              >
            </div>
          </div>
          <div class="card-body">
            <p>Due Date: {{ formatDate(assignment.end_date) }}</p>
          </div>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="Past Assignments">
        <el-card
          class="card"
          v-for="(assignment, index) in pastAssignments"
          :key="index"
        >
          <div slot="header" class="card-header">
            <i class="el-icon-time icon"></i>
            <router-link
              :to="{ name: 'assignmentdetail', params: { id: assignment._id } }"
            >
              <span class="title">{{ assignment.name }}</span>
            </router-link>
            <div class="buttons">
              <el-button
                v-if="hasTutorPermissions"
                type="text"
                icon="el-icon-edit"
                @click="editAssignment(assignment)"
                >Edit</el-button
              >
              <el-button
                v-if="hasTutorPermissions"
                type="text"
                icon="el-icon-delete"
                @click="deleteAssignment(assignment)"
                >Delete</el-button
              >
            </div>
          </div>
          <div class="card-body">
            <p>Due Date: {{ formatDate(assignment.end_date) }}</p>
          </div>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="Assignments in Progress">
        <el-card
          class="card"
          v-for="(assignment, index) in inProgressAssignments"
          :key="index"
        >
          <div slot="header" class="card-header">
            <i class="el-icon-refresh icon"></i>
            <router-link
              :to="{ name: 'assignmentdetail', params: { id: assignment._id } }"
            >
              <span class="title">{{ assignment.name }}</span>
            </router-link>
            <div class="buttons">
              <el-button
                v-if="hasTutorPermissions"
                type="text"
                icon="el-icon-edit"
                @click="editAssignment(assignment)"
                >Edit</el-button
              >
              <el-button
                v-if="hasTutorPermissions"
                type="text"
                icon="el-icon-delete"
                @click="deleteAssignment(assignment)"
                >Delete</el-button
              >
            </div>
          </div>
          <div class="card-body">
            <p>Due Date: {{ formatDate(assignment.end_date) }}</p>
          </div>
        </el-card>
      </el-collapse-item>
    </el-collapse>

    <el-dialog
      title="Edit Assignment"
      :visible="showEditDialog"
      @close="showEditDialog = false"
    >
      <el-form>
        <el-form-item label="Name">
          <el-input v-model="editedAssignmentName"></el-input>
        </el-form-item>
        <el-form-item label="End Date">
          <el-date-picker
            v-model="editedAssignmentEndDate"
            format="dd-MM-yyyy"
            type="date"
            placeholder="Select date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Score">
          <el-table :data="editedAssignmentScore" style="width: 100%">
            <el-table-column prop="criteria" label="Criteria"></el-table-column>
            <el-table-column prop="ratings" label="Ratings"></el-table-column>
            <el-table-column prop="pts" label="Points">
              <template slot-scope="scope">
                <el-input v-model="scope.row.pts"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="editedAssignmentDescription"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="saveAssignment">Save</el-button>
          <el-button @click="showEditDialog = false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
  
  <script>
import moment from "moment";
export default {
  data() {
    return {
      upcomingAssignments: [],
      pastAssignments: [],
      inProgressAssignments: [],
      hasTutorPermissions: "",
      showEditDialog: false,
      editedAssignmentName: "",
      editedAssignmentEndDate: "",
      editedAssignmentDescription: "",
      editedAssignmentScore: [],
      assginmentID: "",
    };
  },
  methods: {
    formatDate(date) {
      return moment.utc(date).format('DD MMM YYYY');
    },
    editAssignment(index) {
      console.log(index);
      this.editedAssignmentName = index.name;
      this.editedAssignmentEndDate = index.end_date;
      this.editedAssignmentScore = index.score;
      this.editedAssignmentDescription = index.description;
      this.assginmentID = index._id;
      this.showEditDialog = true;
    },
    saveAssignment() {
      console.log(this.editedAssignmentEndDate);
      this.$http
        .post("/updateassignment", {
          assignmentID: this.assginmentID,
          name: this.editedAssignmentName,
          end_date: moment(this.editedAssignmentEndDate).format('YYYY-MM-DD'),
          score: this.editedAssignmentScore,
          description: this.editedAssignmentDescription,
        })
        .then((res) => {
          if (res.data.flag) {
            this.$message.success(res.data.message);
            this.showEditDialog = false;
            this.$http
              .post("/getassignment", {
                courseID: localStorage.getItem("item_id"),
              })
              .then((res) => {
                if (res.data.flag) {
                  this.upcomingAssignments = res.data.notStartedTasks;
                  this.pastAssignments = res.data.completedTasks;
                  this.inProgressAssignments = res.data.ongoingTasks;
                } else {
                  this.$message.error(res.data.message);
                }
              });
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    deleteAssignment(index) {
      this.assginmentID = index._id;
      this.$confirm(
        "This operation will permanently delete the task, continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          console.log(this.assginmentID);
          this.$http
            .post("/deleteassignment", {
              assignmentID: this.assginmentID,
              courseID: localStorage.getItem("item_id"),
            })
            .then((res) => {
              if (res.data.flag) {
                this.$message({
                  type: "success",
                  message: "Delete completed!",
                });
                this.$http
                  .post("/getassignment", {
                    courseID: localStorage.getItem("item_id"),
                  })
                  .then((res) => {
                    if (res.data.flag) {
                      this.upcomingAssignments = res.data.notStartedTasks;
                      this.pastAssignments = res.data.completedTasks;
                      this.inProgressAssignments = res.data.ongoingTasks;
                    } else {
                      this.$message.error(res.data.message);
                    }
                  });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delete canceled",
          });
        });
    },
  },
  mounted() {
    if (this.$store.getters.user.identity == "tutor") {
      this.hasTutorPermissions = true;
    } else {
      this.hasTutorPermissions = false;
    }
    this.$http
      .post("/getassignment", {
        courseID: localStorage.getItem("item_id"),
      })
      .then((res) => {
        if (res.data.flag) {
          this.$message.success(res.data.message);
          console.log(res.data);
          this.upcomingAssignments = res.data.notStartedTasks;
          this.pastAssignments = res.data.completedTasks;
          this.inProgressAssignments = res.data.ongoingTasks;
        } else {
          this.$message.error(res.data.message);
        }
      });
  },
};
</script>


<style scoped>
.card {
  background-color: #f7f7f7;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fff;
}

.title {
  font-size: 18px;
  font-weight: 500;
  margin-left: 10px;
}

.icon {
  font-size: 24px;
  color: #409eff;
}

.card-body {
  padding: 20px;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.buttons > * {
  margin-left: 10px;
}

.buttons > *:first-child {
  margin-left: 0;
}
</style>
  
