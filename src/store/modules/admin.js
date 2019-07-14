//用户管理公共状态
import { getUserList } from '@/api/admin'
const state = {
    UserList: null
}

const mutations = {
    SET_USERLIST: (state, data) => {
        state.UserList = [...data]
    }
}

const actions = {
    get_UserList({ commit }, params) {
        getUserList().then(({ data }) => {
            commit('SET_USERLIST', data)
        }).catch(() => {
            commit('SET_USERLIST', null)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}