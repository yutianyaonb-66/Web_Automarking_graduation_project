<template>
  <div>
    <div class="course-container">
      <span class="course-name">
        <i class="el-icon-monitor"></i>
        {{ courseName }}
      </span>
    </div>
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
      <el-radio-button :label="false">Show</el-radio-button>
      <el-radio-button :label="true">Hide</el-radio-button>
    </el-radio-group>

    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
    >
      <template v-for="item in items">
        <el-submenu v-if="item.children" :index="item.path" :key="item.path">
          <template slot="title">
            <i class="el-icon-s-claim"></i>
            <span slot="title">{{ item.name }}</span>
          </template>
          <router-link
            v-for="(citem, cindex) in item.children"
            :to="citem.path"
            :key="cindex"
          >
            <el-menu-item :index="citem.path">
              <span slot="title">{{ citem.name }}</span>
            </el-menu-item>
          </router-link>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
  <style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
  
  <script>
export default {
  data() {
    return {
      role: "",
      items: [],
      isCollapse: false,
    };
  },
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
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  created() {
    this.role = this.$store.getters.user.identity;
    switch (this.role) {
      case "student":
        this.items = [
          {
            icon: "fa-money",
            name: "Course System",
            path: "fund",
            children: [
              { path: "/showassignment", name: "Show All Assignments" },
              { path: "/checkmarks", name: "Marks" },
            ],
          },
        ];
        break;
      case "tutor":
        this.items = [
          {
            icon: "fa-money",
            name: "Course System",
            path: "fund",
            children: [
              { path: "/createassignment", name: "Add New Assignemnet" },
              { path: "/showassignment", name: "Show All Assignments" },
            ],
          },
        ];
        break;
      case "admin":
        this.items = [{}];
        break;
      default:
    }
  },
};
</script>

<style>
.course-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
}

.course-name {
  margin-bottom: 0px;
  font-size: 22px;
  font-family: "Microsoft YaHei";
  letter-spacing: 3px;
}
</style>