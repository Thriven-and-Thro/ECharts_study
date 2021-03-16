import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import axios from 'axios'

import './assets/css/common.less'

import SocketService from '@/utils/socket_service'

// 调用方法连接服务器
SocketService.Instance.connect()
// 将对象挂载到原型上，使其他组件可以调用
Vue.prototype.$socket = SocketService.Instance

// 封装
// 默认路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 放在原型上
// Vue.prototype.$http = axios

// 将echarts放在vue原型上
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
