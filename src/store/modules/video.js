//项目 公共状态
import Cookies from 'js-cookie'

function getIds() {
    return Cookies.get('IDS')
}
const state = {
    Ids: getIds() ? JSON.parse(getIds()) : null
}

const mutations = {
    SET_IDS: (state, arr) => {
        state.Ids = [...arr]
        Cookies.set('IDS', arr)
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