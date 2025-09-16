<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <div slot="empty" style="text-align: left">
        <el-empty description="Empty" />
      </div>
      <el-table-column fixed prop="firstname" label="Firstname">
      </el-table-column>
      <el-table-column prop="lastname" label="Lastname"> </el-table-column>
      <el-table-column prop="email" label="Email"> </el-table-column>
      <el-table-column prop="identity" label="Role" width="100">
      </el-table-column>
      <el-table-column fixed="right" label="Role Change">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.identity"
            placeholder="Please choose"
            @change="onStatusChange(scope.row)"
          >
            <el-option label="Student" value="student"></el-option>
            <!-- <el-option label="admin" value="admin"></el-option> -->
            <el-option label="Tutor" value="tutor"></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <div class="centered-button">
      <el-button type="primary" @click="dialogFormVisible = true"
        >Invite an user</el-button
      >
    </div>
    <el-dialog title="Invite a user" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="Email address"
          type="email"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Choose a role" :label-width="formLabelWidth">
          <el-select
            v-model="form.identity"
            placeholder="Please choose a role"
          >
            <el-option label="Admin" value="admin"></el-option>
            <el-option label="Tutor" value="tutor"></el-option>
            <el-option label="Student" value="student"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="
            dialogFormVisible = false;
            submit();
          "
          >Confirm</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import {
//   // These are all used to verify the f_name, l_name, email and password respectively
//   validateCheckPass,
//   checkMai,
// } from "../../components/utils/validate";
export default {
  name: "user-list",
  data() {
    return {
      tableData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        email: "",
        identity: "",
      },
      formLabelWidth: "120px",
      formValid: false,
    };
  },
  methods: {
    onStatusChange(row) {
      // console.log(`行 ${row._id} 的状态更改为 ${row.identity}`);
      this.$http.post("/changidentitybyid", {
        id: row._id,
        identity: row.identity,
      });
    },

    //send the email to invite an user to register
    submit() {
      if (this.formValid) {
        this.$http
          .post("inviteEmail", {
            email: this.form.email,
            identity: this.form.identity,
          })
          .then((res) => {
            if (res.data.flag) {
              this.$message.success(res.data.message);
              this.form.email = "";
              this.form.identity = "";
            } else {
              this.$message.error(res.data.message);
            }
          });
      } else {
        // If there are still fields left unfilled
        this.$message.error(
          "The E-mail format is wrong or still incomplete items, please check and submit!"
        );
      }
    },
  },
  mounted() {
    this.$http.post("userlist").then((res) => {
      if (res.data.flag) {
        this.tableData = res.data.user;
      } else {
        console.log(res.data.message);
      }
    });
  },
  watch: {
    form: {
      deep: true,
      handler() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.form.email && this.form.identity) {
          if (emailRegex.test(this.form.email)) {
            this.formValid = true;
          } else {
            this.formValid = false; 
          }
        } else {
          this.formValid = false; 
        }
      },
    },
  },
};
</script>

<style scoped>
.centered-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px;
}
</style>