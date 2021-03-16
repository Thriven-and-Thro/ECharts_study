import Vue from 'vue'
import VueRouter from 'vue-router'

const SellerPage = () => import('@/views/seller/SellerPage')
const TrendPage = () => import('@/views/trend/TrendPage')
const MapPage = () => import('@/views/map/MapPage')
const RankPage = () => import('@/views/rank/RankPage')
const HotPage = () => import('@/views/hot/HotPage')
const StockPage = () => import('@/views/stock/StockPage')
const Screen = () => import('@/views/Screen')

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/screen'
  },
  {
    path: '/screen',
    component: Screen
  },
  {
    path: '/seller',
    component: SellerPage
  },
  {
    path: '/trend',
    component: TrendPage
  },
  {
    path: '/map',
    component: MapPage
  },
  {
    path: '/rank',
    component: RankPage
  },
  {
    path: '/hot',
    component: HotPage
  },
  {
    path: '/stock',
    component: StockPage
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
