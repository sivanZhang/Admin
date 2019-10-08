/**
 * 
 *@file 不带权限的静态路由
 *  
 */
import Layout from '@/layout'
export default [
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
    children: [{
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
    children: [{
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
      },
      {
        path: 'clockin-import',
        name: 'clockin-import',
        component: () =>
          import('@/views/checking-in/clockin-import'),
        meta: {
          title: '打卡导入',
          icon: 'assetlist'
        },
        hidden: true
      },
      {
        path: 'date-import',
        name: 'date-import',
        component: () =>
          import('@/views/admin/date-import'),
        meta: {
          title: '节假日导入',
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
    path: '/checking-in',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
      title: '考勤管理',
      icon: 'kq'
    },
    children: [{
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
        path: 'view-extra-work',
        name: 'view-extra-work',
        component: () =>
          import('@/views/checking-in/view-extra-work'),
        meta: {
          title: '加班查看',
          icon: 'jbck'
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
      },
      {
        path: 'clock-in',
        name: 'clock-in',
        component: () =>
          import('@/views/checking-in/clock-in'),
        meta: {
          title: '打卡管理',
          icon: 'daka'
        }
      }
    ]
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