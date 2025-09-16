<template>
  <div class="home">
    <div class="container">
      <h1 class="title">Course System</h1>
      <h2 class="course-name">{{ courseName }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home-page",
  computed: {
    courseName() {
      const storedCourseName = localStorage.getItem("item_name");
      if (storedCourseName && storedCourseName.trim() !== "") {
        return storedCourseName;
      } else {
        return "";
      }
    },
  },
};
</script>


<style scoped>
.home {
  width: 100%;
  height: 100%;
  /* background: url(../../assets/sydney.jpg) no-repeat; */
  background-size: 100% 100%;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 100px;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: white;
}
.title {
  font-size: 30px;
  margin-bottom: 10px;
}
.course-name {
  margin-top: 10px;
}
.lead {
  margin-top: 50px;
  font-size: 22px;
}
</style>