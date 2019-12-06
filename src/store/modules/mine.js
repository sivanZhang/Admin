
const state = {
  // 主页跳转我的任务带的参数
  keyword: '',
  // 消息中跳转我的任务，带的ID
  taskID: null
}

const mutations = {
  SET_KEYWORD: (state, str = '') => {
    state.keyword = str
  },
  setTaskId(state, id = null) {
    state.taskID = id
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

