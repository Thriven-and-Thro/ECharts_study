import Vue from 'vue'
import VueRouter from 'vue-router'

const SellerPage = () => import('@/views/seller/SellerPage')
const TrendPage = () => import('@/views/trend/TrendPage')

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/trend'
  },
  {
    path: '/seller',
    component: SellerPage
  },
  {
    path: '/trend',
    component: TrendPage
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
