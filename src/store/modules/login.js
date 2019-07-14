//登录状态管理
import * as userApi from '@/api/login'
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'
import {
    resetRouter
} from '@/router'
const state = {
    token: getToken(),
    name: '',
    avatar: ''
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
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
                setToken(data.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            userApi.getInfo(state.token).then(({ data }) => {
                if (!data) {
                    reject('Verification failed, please Login again.')
                }
                const {
                    name,
                    avatar
                } = data

                commit('SET_NAME', name)
                commit('SET_AVATAR', avatar)
                resolve(data)
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