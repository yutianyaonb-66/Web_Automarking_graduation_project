<template>
  <div>
  <el-alert
    :title= "alarm"
    type="warning"
    center
    show-icon>
  </el-alert>
  <el-alert
    :title= "time"
    type="warning"
    center
    show-icon>
  </el-alert>
  </div>
</template>

<script>
export default {
    name:'active-list',
    data() {
      return {
        message: {
            email:this.$route.query.id,
        },
        alarm:'',
        time:''
      }
    },
    mounted() {
        this.$http.post('active',this.message).then(res=>{
               this.alarm=res.data.message             
        })
        let time = 5;
        let timer = setInterval(()=>{
        time--;
        this.time ='Automatically jump to the login page after ' + time + ' second';
        if(time === 0){
            this.$router.push('/login');
            clearInterval(timer);
            }
        },1000)
    },
}
</script>

<style>

</style>