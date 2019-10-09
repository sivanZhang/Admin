/**
 * 
 *@file 带权限的动态路由
 *  
 */
import Layout from '@/layout'
export default [{
    path: '/team-manager',
    component: Layout,
    redirect: '/',
    alwaysShow: true,
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
        title: '任务分配',
        icon: 'team-manager',
        roles: 'dept_manager'
      }
    }, {
      path: 'statistic-manager',
      name: 'statistic-manager',
      component: () =>
        import('@/views/team-manager/statistic-manager'),
      meta: {
        title: '数据统计',
        icon: 'statistic-manager',
        roles: 'dept_manager'
      }
    }]
  }, {
    path: '/task',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '审批',
      icon: 'task',
      roles: 'manage_approve'
    },
    children: [{
        path: 'approve',
        name: 'approve',
        component: () =>
          import('@/views/video/my-audit'),
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
          import('@/views/video/extra-audit'),
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
          import('@/views/video/video-check'),
        meta: {
          title: '审核意见',
          activeMenu: '/task/approve'
        },
        hidden: true
      }
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
  }, { // 404必须在最后面
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/admin',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '系统设置',
      icon: 'settings'
    },
    children: [{
        path: 'profession',
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
      {
        path: 'menu',
        name: 'menu',
        component: () =>
          import('@/views/admin/menu'),
        meta: {
          title: '考勤时间设置',
          icon: 'menu',
        }
      },
    ]
  },
]
