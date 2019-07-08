/**
 * 
 *@file 判断登录权限
 *  
 */

import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/login', '/forgot', '/signup'] // 不重定向的页面

router.beforeEach(async(to, from, next) => {
    // 进度条开始
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)

    // 判断cookie中的token 确定是否已登录
    const hasToken = getToken()

    if (hasToken) {
        if (to.path === '/login') {
            // 如果已经登录，跳转login页面会重定向到首页
            next({ path: '/' })
            NProgress.done()//加载进度条完成
        } else {//如果跳转非login页
            next()
            /*const hasGetUserInfo = store.getters.name//获取状态机中取到的username
            if (hasGetUserInfo) {//如果取到name 就正常跳转
                next()
            }  else {//没有取到就获取用户信息
                try {
                    // get user info
                    await store.dispatch('user/getInfo')

                    next()
                } catch (error) {
                    // remove token and go to login page to re-login
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            } */
        }
    } else {//没有token
        
        if (whiteList.indexOf(to.path) !== -1) {//判断是否在不重定向的名单中
            next()//正常跳转
        } else {
            //重定向到login页面
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // 路由进入页面后关闭进度条
    NProgress.done()
})