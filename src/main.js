import Vue from 'vue'
import App from './App.vue'
import http from './api'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import md5 from 'js-md5';
import axios from './http';

Vue.use(ElementUI);
Vue.prototype.$axios = axios
Vue.config.productionTip = false


Vue.prototype.$http = http;
Vue.prototype.$md5 = md5;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

