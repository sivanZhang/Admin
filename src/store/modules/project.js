//项目 公共状态
import { getProjects } from '@/api/project'
const state = {
    ProjectList: null
}

const mutations = {
    SET_PROJECTS: (state, data) => {
        state.ProjectList = [...data]
    }
}

const actions = {
    get_Projects({ commit }, params) {
        getProjects().then(({ data }) => {
            commit('SET_PROJECTS', data.msg)
        }).catch(() => {
            commit('SET_PROJECTS', null)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}