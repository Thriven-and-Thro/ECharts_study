import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: 'chalk'
  },
  mutations: {
    changeTheme(state) {
      state.theme = state.theme === "chalk" ? 'vintage' : 'chalk'
    }
  },
  actions: {
  },
  modules: {
  },
})
