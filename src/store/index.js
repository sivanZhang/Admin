import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import login from './modules/login'
import admin from './modules/admin'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    login,
    admin
  },
  getters
})

export default store
