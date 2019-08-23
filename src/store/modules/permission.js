import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(route, UserRoles) {
    let arr = Object.keys(UserRoles)
    if (route.meta && Object.keys(route.meta).includes('roles')) {
        let BL = arr.some(roleName => roleName === route.meta.roles && UserRoles[roleName])
        return BL
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
    const res = []
    routes.forEach(route => {
        if (hasPermission(route, UserRoles)) {
            if (route.children) {
                route.children = filterAsyncRoutes(route.children, UserRoles)
            }
            res.push(route)
        }
    })

    return res
}

const state = {
    routes: [], //用来在侧边栏显示已经挂载的路由列表
    addRoutes: [] //筛选出来有权限进入的动态路由
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        console.log(state.addRoutes, 'state.addRoutes');

        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    generateRoutes({ state, commit, rootState }) {
        let UserRoles = rootState.login.userInfo.auth
        return new Promise(resolve => {
            let accessedRoutes = filterAsyncRoutes(asyncRoutes, UserRoles)
                //accessedRoutes有权限的路由
            commit('SET_ROUTES', accessedRoutes)
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