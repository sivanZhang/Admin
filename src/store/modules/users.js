//封装用户列表
import { getUserList } from '@/api/admin'
const state = {
  UserList = []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}

const actions = {
  login({ commit }, { username, password }) {
    getUserList().then(({ data }) => {

    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}