<template>
    <el-row class="menu_page">
         <el-col>
             <el-menu
                mode="vertical"
                background-color="#324057"
                text-color="#fff"
                
                active-text-color="#409eff" 
                class="el-menu-vertical-demo">
                <router-link to="/home">
                    <el-menu-item index="0">
                        <i class="fa fa-margin fa-server"></i>
                        <span slot="title">Home</span>
                    </el-menu-item>
                </router-link>
                <template  v-for="item in items" >
                    <el-submenu v-if="item.children" :index="item.path" :key="item.path">
                        <template slot="title">
                            <i :class="'fa fa-margin '+item.icon"></i>
                            <span slot="title">{{item.name}}</span>
                        </template>
                        <router-link v-for="(citem,cindex) in item.children" 
                            :to="citem.path" :key="cindex">
                            <el-menu-item 
                                :index='citem.path'>
                                <span slot="title">{{citem.name}}</span>
                            </el-menu-item> 
                        </router-link>
                    </el-submenu>
                </template>
             </el-menu>
         </el-col>
    </el-row>
</template>
<script>
export default {
  name: "left-menu",
  data() {
    return {
      role:'',
      items: []
    };
  },
  created(){
    this.role = this.$store.getters.user.identity
    switch (this.role) {
      case 'student':
        this.items = [{
          icon: "fa-money",
          name: "Course System",
          path: "fund",
          children: [
           { path: "/showcourse", name: "Show Course" },
           { path: "/enrollcourse", name: "Enroll Course" },
          ]
          },
        ]
        break;
      case 'tutor':
      this.items = [{
          icon: "fa-asterisk",
          name: "Course Management",
          path: "info",
          children: [
            { path: "/showcourse", name: "Show Course" },
            { path: "/createcourse", name: "Create Course" }
          ]
          
        }]
        break;
        case 'admin':
      this.items = [
        {
          icon: "fa-asterisk",
          name: "Course Management",
          path: "info",
          children: [
            { path: "/infoshow", name: "Authority Change" },
            { path: "/auditcourse", name: "Audit Course" },
            { path: "/auditstudent", name: "Audit Student"}
          ]
        }]
        break;
      default:
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
};
</script>
<style scoped>
.menu_page {
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;

}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
  font-size: 15px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}
</style>
