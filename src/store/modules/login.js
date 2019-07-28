//登录状态管理
import * as userApi from '@/api/login'
import {
    getToken,
    setToken,
    removeToken,
    getUserInfo,
    setUserinfo
} from '@/utils/auth'
import {
    resetRouter
} from '@/router'
import Cookies from 'js-cookie'
const state = {
    token: getToken(),
    userInfo: getUserInfo()
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo
    }
}

const actions = {
    login({ commit }, { username, password }) {
        return new Promise((resolve, reject) => {
            userApi.login({
                email: username.trim(),
                password: password
            }).then(({ data }) => {
                commit('SET_TOKEN', data.token);
                setToken(data.token);
                commit('SET_USERINFO', data);
                setUserinfo(data);
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    /*   logout({
        commit,
        state
      }) {
        return new Promise((resolve, reject) => {
          userApi.logout(state.token).then(() => {
            commit('SET_TOKEN', '')
            removeToken()
            resetRouter()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }, */
    logout({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            commit('SET_TOKEN', '')
            removeToken()
            resetRouter()
            resolve()
        })
    },
    resetToken({
        commit
    }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}