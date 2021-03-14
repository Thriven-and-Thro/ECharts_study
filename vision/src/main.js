import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import './assets/css/common.less'
import '../public/font/iconfont.css'

// 封装
// 默认路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 放在原型上
Vue.prototype.$http = axios

// 将echarts放在vue原型上
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
