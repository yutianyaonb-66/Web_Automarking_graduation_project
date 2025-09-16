<template>
    <div class="index">
      <LeftMenu></LeftMenu>
      <div class="rightContainer">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script>
  import LeftMenu from "../coursedetail/components/LeftNav.vue";
  
  export default {
    name: "course-index",
    components: {
      LeftMenu
    }
  };
  </script>
  <style scoped>
  .index {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: grid;
  grid-template-columns: auto 1fr;
  }
  .rightContainer {
    position: relative;
  height: 100vh;
  overflow: auto;
  }
  </style>
  
  