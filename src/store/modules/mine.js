const state = {
  // 主页跳转我的任务带的参数
  keyword: '',
  task_id: ''
}

const mutations = {
  SET_KEYWORD: (state, str = '') => {
    state.keyword = str
  },
  setTaskId: (state, id = '') => {
    state.task_id = id
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
