import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'
/**
 //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
hidden: true // (默认 false)

//当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
redirect: 'noRedirect'

//当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
//只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
//若你想不管路由下面的 children 声明的个数都显示你的根路由
//你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
alwaysShow: true

name: 'router-name' //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
meta: {
  roles: 'manage_approve' //设置该路由进入的权限
  title: 'title' //设置该路由在侧边栏和面包屑中展示的名字
  icon: 'svg-name' //设置该路由的图标
  noCache: true //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
  breadcrumb: false // 如果设置为false，则不会在breadcrumb面包屑中显示
}
 */

//涉及权限的动态加载路由
export const asyncRoutes = [ {
        path: '/task',
        component: Layout,
        redirect: 'noRedirect',
        // alwaysShow: true,
        meta: {
            title: '审批',
            icon: 'task',
            roles: 'manage_approve'
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
                path: 'audit-approve',
                name: 'audit-approve',
                component: () =>
                    import ('@/views/video/extra-audit'),
                meta: {
                    title: '客户审批',
                    icon: 'v2',
                    roles: 'manage_approve'
                }
            },
            {
                path: '/check-video',
                name: 'check-video',
                component: () =>
                    import ('@/views/video/video-check'),
                meta: {
                    title: '审核意见',
                    activeMenu: '/task/approve'
                },
                hidden: true
            },
        ]
    }, {
        path: '/admin',
        component: Layout,
        redirect: 'noRedirect', //点击2级面包屑对应哪个路由，如果和path一样就不会跳转
        meta: {
          title: '审核意见',
          activeMenu: '/task/approve'
        },
        hidden: true
      }
    ,{
    path: '/admin',
    component: Layout,
    redirect: 'noRedirect', // 点击2级面包屑对应哪个路由，如果和path一样就不会跳转
    meta: {
      title: '系统设置',
      icon: 'settings'
    },
    children: [
      {
        path: 'profession', // 直接写字符串会生成"/admin/profession";如果前面带/就是绝对路径了，会生成"/profession"
        name: 'profession',
        component: () =>
          import('@/views/admin/userGroup'),
        meta: {
          title: '用户',
          icon: 'group'
        }
      },
      {
        path: 'userGroup',
        name: 'UserGroup',
        component: () =>
          import('@/views/admin/profession'),
        meta: {
          title: '部门及工种',
          icon: 'profession'
        }
      },
      {
        path: 'roles',
        name: 'UserGqqqroup',
        component: () =>
          import('@/views/admin/roles'),
        meta: {
          title: '角色管理',
          icon: 'role',
          roles: 'manage_role'
        }
      },
      {
        path: 'bind',
        name: 'settings',
        component: () =>
          import('@/views/admin/bind'),
        meta: {
          title: '绑定',
          icon: 'bangding'
        }
      },
      {
        path: 'attrs',
        name: 'customAttrs',
        component: () =>
          import('@/views/admin/customAttrs'),
        meta: {
          title: '自定义属性',
          icon: 'custom-attrs',
        }
      },
      {
        path: 'time-management',
        name: 'time-management',
        component: () =>
          import('@/views/admin/time-management'),
        meta: {
          title: '时间管理',
          icon: 'fs',
        }
      },
      {
        path: 'extra-approve',
        name: 'extra-approve',
        component: () =>
          import('@/views/checking-in/extra-approve'),
        meta: {
          title: '加班审批模板',
          icon: 'extra-approve',
        }
      },
    ]
  },
  {
    path: '/material',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '素材库',
      icon: 'task'
    },
    children: [{
      path: 'material',
      name: 'material',
      component: () =>
        import('@/views/material'),
      meta: {
        title: '素材库',
        icon: 'material'
      }
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/team-manager',
    component: Layout,
    redirect: '/',
    meta: {
      title: '组长工作台',
      icon: 'team-manager',
      roles: 'dept_manager'
    },
    children: [{
      path: 'team-manager',
      name: 'team-manager',
      component: () =>
        import('@/views/team-manager'),
      meta: {
        title: '组长工作台',
        icon: 'team-manager',
        roles: 'dept_manager'
      }
    }]
  }
]

// 不涉及权限的固定路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () =>
        import('@/views/redirect/index')
    }]
  }, {
    path: '/login',
    component: () =>
      import('@/views/login/signin'),
    hidden: true
  },
  {
    path: '/login-task',
    component: () =>
      import('@/views/myTask/loginMyTask'),
    hidden: true
  },
  {
    path: '/mytaskplug',
    component: () =>
      import('@/views/myTask/myTaskPlug'),
    hidden: true
  },
  {
    path: '/forgot',
    component: () =>
      import('@/views/login/passwordReset'),
  },
  {
    path: '/signup',
    component: () =>
      import('@/views/login/signup'),
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
    children: [
      {
        path: '/overview/project',
        name: 'overview-project',
        component: () =>
          import('@/views/overview/project'),
        meta: {
          title: '项目概览',
          icon: 'tree'
        }
      },
      {
        path: '/overview/training',
        name: 'overview-training',
        component: () =>
          import('@/views/training/training-project'),
        meta: {
          title: '实训项目',
          icon: 'tree2'
        },
      }
    ]
  },
  {
    path: '/projects',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '项目',
      icon: 'tree-table',
    },
    hidden: true,
    children: [{
      path: 'project-detail/:id',
      name: 'project-detail',
      component: () =>
        import('@/views/projects/project-detail'),
      meta: {
        title: '项目详情',
        icon: 'tree',
      }
    }]
  },
  {
    path: '/import',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '批量上传',
      icon: 'tree-table',
    },
    hidden: true,
    children: [
      {
        path: 'import-users',
        name: 'import-users',
        component: () =>
          import('@/views/admin/user-import'),
        meta: {
          title: '用户上传',
          icon: 'tree'
        }
      },
      {
        path: 'asset-import/:id',
        name: 'asset-import',
        component: () =>
          import('@/views/assetsManagement/asset-import'),
        meta: {
          title: '批量导入',
          icon: 'assetlist'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/mine',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '我的工作台',
      icon: 'task'
    },
    children: [{
      path: 'task',
      name: 'my-task',
      component: () =>
        import('@/views/task'),
      meta: {
        title: '我的任务',
        icon: 'task'
      }
    }]
  },
  {
    path: '/mine',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '我的工作台',
      icon: 'pd'
    },
    children: [{
      path: 'production',
      name: 'my-production',
      component: () =>
        import('@/views/production'),
      meta: {
        title: '我的作品',
        icon: 'pd'
      }
    }]
  },
  {
    path: '/mine',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '我的工作台',
      icon: 'task'
    },
    children: [{
      path: 'man-hour',
      name: 'man-hour',
      component: () =>
        import('@/views/man-hour'),
      meta: {
        title: '我的工时',
        icon: 'fs'
      }
    }]
  },
  {
    path: '/plugin',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '插件',
      icon: 'assets'
    },
    children: [{
      path: 'plugin',
      name: 'plugin',
      component: () =>
        import('@/views/plugin'),
      meta: {
        title: '插件管理',
        icon: 'assets'
      }
    }]
  },
  {
    path: '/sharefiles',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '共享文件',
      icon: 'list'
    },
    children: [{
      path: 'sharefiles',
      name: 'sharefiles',
      component: () =>
        import('@/views/sharefiles'),
      meta: {
        title: '共享文件',
        icon: 'list'
      }
    }]
  },

  {
    path: '/checking-in',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
      title: '加班管理',
      icon: 'kq'
    },
    children: [
      {
        path: 'extra-work',
        name: 'extra-work',
        component: () =>
          import('@/views/checking-in/extra-work'),
        meta: {
          title: '加班申请',
          icon: 'jiaban'
        }
      },
      {
        path: 'approve-extra-work',
        name: 'approve-extra-work',
        component: () =>
          import('@/views/checking-in/approve-extra-work'),
        meta: {
          title: '加班审批',
          icon: 'jbsp'
        }
      },
      {
        path: 'manage-work',
        name: 'manage-work',
        component: () =>
          import('@/views/checking-in/manage-work'),
        meta: {
          title: '工时管理',
          icon: 'team-manager'
        }
      }
    ]
  },
  /* {
      path: '/assetes',
      component: Layout,
      alwaysShow: true,
      hidden: true,.a
      redirect: '/assetes',
      meta: {
          title: '资产管理',
          icon: 'assets'
      },
      children: [{
          path: 'asset-list',
          name: 'asset-list',
          component: () =>
              import ('@/views/assetsManagement/asset-list'),
          meta: {
              title: '资产列表',
              icon: 'assetlist'
          }
      }, ]
  }, */
  {
    path: '/404',
    component: () =>
      import('@/views/404'),
    hidden: true
  }
]
const createRouter = () => new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})
const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
