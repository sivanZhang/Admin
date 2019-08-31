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
export const asyncRoutes = [{
        path: '/task',
        component: Layout,
        redirect: '/task',
        meta: {
            title: '我的工作台',
            icon: 'task'
        },
        children: [{
                path: 'approve',
                name: 'approve',
                component: () =>
                    import ('@/views/video/my-audit'),
                meta: {
                    title: '我的审批',
                    icon: 'v2',
                    roles: 'manage_approve'
                }
            },
            {
                path: '/check-video',
                name: 'check-video',
                component: () =>
                    import ('@/views/video/videoCheck'),
                meta: {
                    title: '审核意见',
                    icon: 'v2'
                },
                hidden: true
            },
        ]
    }, {
        path: '/admin',
        component: Layout,
        redirect: '/admin', //设置成父路由的路径后，点击面包屑不会跳转
        meta: {
            title: '系统设置',
            icon: 'settings'
        },
        children: [{
                path: 'profession', //直接写字符串会生成/settings/userGroup路径   如果前面带/就是绝对路径了，会生成 /userGroup路径
                name: 'profession',
                component: () =>
                    import ('@/views/admin/userGroup'),
                meta: {
                    title: '用户',
                    icon: 'group'
                }
            },
            {
                path: 'userGroup',
                name: 'UserGroup',
                component: () =>
                    import ('@/views/admin/profession'),
                meta: {
                    title: '工种',
                    icon: 'profession'
                }
            },
            {
                path: 'roles',
                name: 'UserGqqqroup',
                component: () =>
                    import ('@/views/admin/roles'),
                meta: {
                    title: '角色管理',
                    icon: 'role',
                    roles: 'manage_role'
                }
            },
            {
                path: 'settings',
                name: 'settings',
                component: () =>
                    import ('@/views/settings/settings'),
                meta: {
                    title: '系统设置',
                    icon: 'settings'
                }
            },
        ]
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]
export const constantRoutes = [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path*',
            component: () =>
                import ('@/views/redirect/index')
        }]
    }, {
        path: '/login',
        component: () =>
            import ('@/views/login/signin'),
        hidden: true
    },
    {
        path: '/login-task',
        component: () =>
            import ('@/views/myTask/loginMyTask'),
        hidden: true
    },
    {
        path: '/mytaskplug',
        component: () =>
            import ('@/views/myTask/myTaskPlug'),
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
        path: '/',
        component: Layout,
        redirect: {
            name: 'overview-project'
        },
        meta: {
            title: '概览',
            icon: 'gailan'
        },
        children: [{
                path: 'overview-project',
                name: 'overview-project',
                component: () =>
                    import ('@/views/overview/project'),
                meta: {
                    title: '项目概览',
                    icon: 'tree'
                },
            },
            {
                path: 'overview-users',
                name: 'overview-users',
                component: () =>
                    import ('@/views/overview/users'),
                meta: {
                    title: '用户概览',
                    icon: 'group'
                },
            }
        ]
    },
    {
        path: '/projects',
        component: Layout,
        redirect: '/projects',
        meta: {
            title: '项目',
            icon: 'tree-table',
            hiddenSideBar: true
        },
        hidden: true,
        children: [{
            path: 'project-detail/:id',
            name: 'project-detail',
            component: () =>
                import ('@/views/projects/project-detail'),
            meta: {
                title: '项目详情',
                icon: 'tree',
                hiddenSideBar: true
            }
        }]
    },
    {
        path: '/task',
        component: Layout,
        redirect: '/task',
        meta: {
            title: '我的工作台',
            icon: 'task'
        },
        children: [{
            path: 'task',
            name: 'my-task',
            component: () =>
                import ('@/views/task'),
            meta: {
                title: '我的任务',
                icon: 'task'
            }
        }]
    },
    {
        path: '/task',
        component: Layout,
        redirect: '/task',
        meta: {
            title: '我的工作台',
            icon: 'task'
        },
        children: [{
            path: 'overview-users1',
            name: 'overview-users1',
            component: () =>
                import ('@/views/overview/users'),
            meta: {
                title: '我的工时',
                icon: 'fs'
            },
        }]
    },
    {
        path: '/task',
        component: Layout,
        redirect: '/task',
        meta: {
            title: '我的工作台',
            icon: 'task'
        },
        children: [{
            path: 'overview-users2',
            name: 'overview-users2',
            component: () =>
                import ('@/views/overview/users'),
            meta: {
                title: '我的信息',
                icon: 'zl'
            },
        }, ]
    },
    {
        path: '/assetes',
        component: Layout,
        alwaysShow: true,
        hidden: true,
        redirect: '/assetes', //设置成父路由的路径后，点击面包屑不会跳转
        meta: {
            title: '资产管理',
            icon: 'assets'
        },
        children: [{
            path: 'asset-list', //直接写字符串会生成/settings/userGroup路径   如果前面带/就是绝对路径了，会生成 /userGroup路径
            name: 'asset-list',
            component: () =>
                import ('@/views/assetsManagement/asset-list'),
            meta: {
                title: '资产列表',
                icon: 'assetlist'
            }
        }, {
            path: 'asset-import/:id', //直接写字符串会生成/settings/userGroup路径   如果前面带/就是绝对路径了，会生成 /userGroup路径
            name: 'asset-import',
            component: () =>
                import ('@/views/assetsManagement/asset-import'),
            meta: {
                title: '资产导入',
                icon: 'assetlist'
            },
            hidden: true
        }, ]
    }, {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    }
]
const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router