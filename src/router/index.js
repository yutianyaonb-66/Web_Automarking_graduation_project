import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index";
import Home from "../views/Home";
import InfoShow from "../views/userlist";
import CreateCourse from "../views/course/CreateCourse";
import AuditCourse from "../views/course/AuditCourse";
import EnrollCourse from "../views/course/EnrollCourse";
import AuditStudent from "../views/course/AuditStudent";
import ShowCourse from "../views/coursedetail/ShowCourse";
import CourseIndex from "../views/coursedetail/CourseIndex";
import InforCourse from "../views/coursedetail/InforCourse";
import CreateAssignment from "../views/coursedetail/CreateAssignment";
import ShowAssignment from "../views/coursedetail/ShowAssignment";
import AssignmentDetail from "../views/assignmentdetail/AssignmentDetail";
import CheckMarks from "../views/assignmentdetail/CheckMarks";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/index",
    },
    {
      path: "/reg",
      component: () => import("../components/page/Registered.vue"),
      meta: {
        title: "UserRegistered",
      },
    },
    {
      path: "/inviteReg",
      component: () => import("../components/page/InviteRegister.vue"),
      meta: {
        title: "InViteUserRegistered",
        
      },
    },
    {
      path: "/login",
      component: () => import("../components/page/Login.vue"),
      meta: {
        title: "UserLogin",
      },
    },
    {
      path: "/active",
      component: () => import("../components/page/Active.vue"),
      meta: {
        title: "UserActive",
      },
    },
    {
      path: "/resetpw",
      component: () => import("../components/page/Resetpw.vue"),
      meta: {
        title: "ResetPassword",
      },
    },
    {
      path: "/changepw",
      component: () => import("../components/page/Changepw.vue"),
      meta: {
        title: "ChangePassword",
      },
    },
    {
      path: "/index",
      component: Index,
      children: [
        { path: "", component: Home },
        { path: "/home", name: "home", component: Home },
        { path: "/infoshow", name: "infoshow", component: InfoShow },
        {
          path: "/createcourse",
          name: "createcourse",
          component: CreateCourse,
        },
        { path: "/auditcourse", name: "auditcourse", component: AuditCourse },
        {
          path: "/auditstudent",
          name: "auditstudent",
          component: AuditStudent,
        },
        {
          path: "/enrollcourse",
          name: "enrollcourse",
          component: EnrollCourse,
        },
        { path: "/showcourse", name: "showcourse", component: ShowCourse },
        {
          path: "/courseindex",
          name: "courseindex",
          component: CourseIndex,
          children: [
            { path: "", component: InforCourse },
            {
              path: "/inforcourse",
              name: "inforcourse",
              component: InforCourse,
            },
            {
              path: "/createassignment",
              name: "createassignment",
              component: CreateAssignment,
            },
            {
              path: "/showassignment",
              name: "showassignment",
              component: ShowAssignment,
            },
            {
                path: "/showassignment/:id",
                name: "assignmentdetail",
                component: AssignmentDetail,
                props: true,
            },
            {
              path:"/checkmarks",
              name:"checkmarks",
              component:CheckMarks,
            },
          ],
        },
      ],
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   const isLogin = localStorage.eleToken ? true : false;
//   if (to.path == "/login" || to.path == "/reg" || to.path == "/inviteReg") {
//     next();
//   } else {
//     isLogin ? next() : next("/login");
//   }
// });

export default router;
