//用户管理和工种公共状态
import {
    getDept
} from "@/api/admin";
import {
    getUserList
} from '@/api/admin'
const state = {
    UserList: null,
    DeptList: null,
}

const mutations = {
    SET_USERLIST: (state, arr) => {
        state.UserList = [...arr]
    },
    SET_DEPTLIST: (state, arr) => {
        state.DeptList = [...arr]
    },
}

const actions = {
    get_UserList({
        commit
    }, params) {
        getUserList().then(({
            data
        }) => {
            commit('SET_USERLIST', data)
        }).catch(() => {
            commit('SET_USERLIST', null)
        })
    },
    get_DeptList({
        commit
    }) {
        getDept().then(({
            data
        }) => {
            commit('SET_DEPTLIST', data.msg)
        }).catch(() => {
            commit('SET_DEPTLIST', null)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}