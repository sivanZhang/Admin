import {
    asyncRoutes,
    constantRoutes,
    notFoundRoutes
} from '@/router'
import router from '@/router'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(route, UserRoles) {
    if (route.meta && 'roles' in route.meta) {
        return UserRoles[route.meta.roles]
    } else {
        return true
    }
}
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, UserRoles) {
    let res = []
    routes.forEach(route => {
        if (hasPermission(route, UserRoles)) {
            const copy = JSON.parse(JSON.stringify(route))
                //此处因为component 不能被深拷贝
            copy.component = () =>
                import (v.component)
            if (copy.children) {
                copy.children = filterAsyncRoutes(copy.children, UserRoles)
            }
            res.push(copy)
        }
    })
    return res
}

const state = {
    routes: [], //用来在侧边栏显示已经挂载的路由列表
    addRoutes: [] //筛选出来有权限进入的动态路由
}

const mutations = {
    SET_ROUTES: (state, arr) => {
        state.addRoutes = arr
        state.routes = constantRoutes.concat(arr)
    }
}

const actions = {
    generateRoutes({
        state,
        commit,
        rootState
    }) {
        let UserRoles = rootState.login.userInfo.auth
        return new Promise(resolve => {
            let accessedRoutes = filterAsyncRoutes(asyncRoutes, UserRoles)
                //accessedRoutes有权限的路由
            commit('SET_ROUTES', accessedRoutes)
            router.addRoutes(asyncRoutes)
            resolve(accessedRoutes)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}