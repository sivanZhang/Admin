import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/signin'),
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },
    {
        path: '/forgot',
        component: () =>
            import ('@/views/login/passwordReset'),
    },
    {
        path: '/signup',
        component: () =>
            import ('@/views/login/signup'),
    },

    {
        path: '/videoCheck',
        component: () =>
            import ('@/views/video/videoCheck'),
    },
    {
        path: '/',
        component: Layout,
        redirect: { name: 'overview-project' },
        meta: { title: '概览', icon: 'gailan' },
        children: [{
                path: 'overview-project',
                name: 'overview-project',
                component: () =>
                    import ('@/views/overview/project'),
                meta: { title: '项目概览', icon: 'tree' },
            },
            {
                path: 'overview-users',
                name: 'overview-users',
                component: () =>
                    import ('@/views/overview/users'),
                meta: { title: '用户概览', icon: 'user' },
            }
        ]
    },
    {
        path: '/projects',
        component: Layout,
        redirect: '/projects',
        meta: { title: '项目', icon: 'tree' },
        children: [{
            path: 'projects-list',
            name: 'projects-list',
            component: () =>
                import ('@/views/projects/projects'),
            meta: { title: '项目', icon: 'tree' }
        }]
    },
    {
        path: '/admin',
        component: Layout,
        redirect: '/admin', //设置成父路由的路径后，点击面包屑不会跳转
        meta: { title: '系统设置', icon: 'settings' },
        children: [{
                path: 'userGroup', //直接写字符串会生成/settings/userGroup路径   如果前面带/就是绝对路径了，会生成 /userGroup路径
                name: 'UserGroup',
                component: () =>
                    import ('@/views/admin/userGroup'),
                meta: { title: '用户和组', icon: 'role' }
            },
            {
                path: 'roles',
                name: 'UserGqqqroup',
                component: () =>
                    import ('@/views/admin/roles'),
                meta: { title: '角色管理', icon: 'role' }
            }
        ]
    },
    {
        path: 'external-link',
        component: Layout,
        children: [{
            path: 'https://panjiachen.github.io/vue-element-admin-site/zh/guide/',
            meta: { title: '使用文档', icon: 'link' }
        }]
    },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router