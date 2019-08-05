//用户管理和工种公共状态
import {
    getDept,
    getDeptUsers
} from "@/api/admin";
import {
    getUserList
} from '@/api/admin'
const state = {
    UserList: null,
    DeptList: null,
    DeptUsers: null
}

const mutations = {
    SET_USERLIST: (state, arr) => {
        state.UserList = [...arr]
    },
    SET_DEPTLIST: (state, arr) => {
        state.DeptList = [...arr]
    },
    SET_DEPTUSERS: (state, arr) => {
        state.DeptUsers = [...arr]
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
        return getDept().then(({
            data
        }) => {
            commit('SET_DEPTLIST', data.msg)
        }).catch(() => {
            commit('SET_DEPTLIST', null)
        })
    },
    get_DeptUsers({
        commit
    }) {
        return getDeptUsers(data).then(({
            data
        }) => {
            commit('SET_DEPTUSERS', data.msg)
        }).catch(() => {
            commit('SET_DEPTUSERS', null)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}