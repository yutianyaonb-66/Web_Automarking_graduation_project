<template>
  <div>
    <el-form :label-position="labelPosition" label-width="80px"  :model="formLabelAlign">
        <el-form-item label="Current Password:" prop="currentpwd">
            <el-input
              type="password"
              v-model="formLabelAlign.currentpwd"
              prefix-icon="el-icon-lock"
              placeholder="Please input current password"
            ></el-input>
          </el-form-item>
          <el-form-item label="New password:" prop="newpwd">
            <el-input
              type="password"
              v-model="formLabelAlign.newpwd"
              prefix-icon="el-icon-lock"
              placeholder="Please input password again"
              @keyup.enter.native="submitForm()"
            ></el-input>
          </el-form-item>
    </el-form>
    <el-button type="primary" @click="onSubmit()">Confirm</el-button>
  </div>
</template> 

<script>
  export default {
    data() {
      return {
        labelPosition: 'top',
        formLabelAlign: {
          currentpwd: '',
          newpwd: ''
        },
        userid:''
      }
    },         
    methods:{
      validPassword:function(password){
        var re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        return re.test(password);
      },
      onSubmit(){
        let md5password = this.$md5(this.formLabelAlign.currentpwd)
        if (!this.validPassword(this.formLabelAlign.newpwd)){
          this.$message({
            type:'warning',
            message:'Password contains at least numbers and letters, length 6-20'
          });
        }else{
          this.$http
          .post('/getuser',{
              email:localStorage.ms_email
              })
          .then((res)=>{
              let correctPWD = res.data.user.password 
              this.userid = res.data.user._id
              if (md5password != correctPWD){
                  this.$message({
                      type:'warning',
                      message:'Sorry! The current password you entered is incorrect, please re-enter it!'
                  });
              }else{
                  this.$http
                    .post('/updatePassword',{
                        newpwd:this.$md5(this.formLabelAlign.newpwd),
                        userid:this.userid
                        })
                    .then((res) => {
                        if (res.data.flag) {
                        this.$message.success(res.data.message);
                        this.formLabelAlign.currentpwd='',
                        this.formLabelAlign.newpwd=''
                        } else {
                        this.$message.error(res.data.message);
                        }
                    })
              }
          })
        }
      }
    }
  }
</script>