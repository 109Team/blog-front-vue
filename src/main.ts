import Vue from 'vue';
import { Component } from 'vue-property-decorator'; 

import App from './App.vue';
import API from '@/api/index';
import store from './store';
import router from './router';
import './registerServiceWorker';

Vue.config.productionTip = false;
Vue.prototype.$API = API;

// 注册路由守卫
Component.registerHooks([
  'beforeRouteEnter', 
  'beforeRouteLeave', 
  'beforeRouteUpdate' 
])

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');