<template>
    <div id="app">
      <div class="carousel-wrapper">
        <el-carousel :interval="4000" type="card" height="400px" trigger="click">
          <el-carousel-item v-for="item in data" :key="item._id">       
            <div class="carousel-item-content">                 
              <h3 class="carousel-item-title">{{ item.course_code }}</h3>
              <h3 class="carousel-item-subtitle">{{ item.course_name }}</h3>
              <el-button type="primary"  @click="navigateToPage(item)">Entry</el-button>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </template>


<script>
export default {
    name:'show-course',
    data() {
        return{
            data:[]
        }
    },
    mounted() {
        this.$http.post('/getcourse',{
            userid:this.$store.getters.user.id,
        })
        .then((res) => {
                if (res.data.flag) {
                  this.$message.success(res.data.message);
                  console.log(res.data.course);
                  this.data=res.data.course
                } else {
                  this.$message.error(res.data.message);
                }
              });
    },
    methods: {
    navigateToPage(item) {
      console.log(item._id);
      localStorage.setItem('item_id', item._id);
      localStorage.setItem('item_name',item.course_code)
      this.$router.push({ name: 'inforcourse', params: { id: item._id }})
    }
  }

}
</script>

<style>
  #app {
    height: 100vh;
    position: relative;
  }
  .carousel-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.5);
    width: 100%;
  }
    .el-carousel__item h3 {
      color: #475669;
      font-size: 14px;
      opacity: 0.75;
      line-height: 200px;
      margin: 0;
    }
    
    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }
    
    .el-carousel__item:nth-child(2n+1) {
      background-color: #d3dce6;
    }

    .carousel-item-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 85%;
      padding: 20px;
      box-sizing: border-box;
  }

  .carousel-item-title {
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
  }

  .carousel-item-subtitle {
    font-size: 24px;
    text-align: center;
    margin-bottom: 20px;
  }

</style>