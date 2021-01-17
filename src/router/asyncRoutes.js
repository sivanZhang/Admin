/* eslint-disable no-sparse-arrays */
/**
 *
 * @file 动态路由
 *
 */
import Layout from '@/layout';
export default function asyncRoutes(params) {
  return [
    {
      path: '/',
      component: Layout,
      redirect: {
        name: 'overview-project'
      },
      meta: {
        breadcrumb: false,
        title: '',
        icon: 'gailan'
      },
      children: [
        {
          path: 'project',
          name: 'overview-project',
          component: () => import('@/views/overview/project'),
          meta: {
            title: '项目概览',
            icon: 'tree',
            roles: 'system_auth'
          }
        }
        // {
        //   path: 'home-page',
        //   name: 'home-page',
        //   component: () => import('@/views/overview/home-page'),
        //   meta: {
        //     title: '个人首页',
        //     icon: 'home'
        //   }
        // }
      ]
    },
    /* {
      path: '/overview',
      component: Layout,
      redirect: {
        name: 'home-page'
      },
      meta: {
        title: '概览',
        icon: 'gailan'
      },
      children: [
        {
          path: 'project',
          name: 'overview-project',
          component: () => import('@/views/overview/project'),
          meta: {
            title: '项目概览',
            icon: 'tree',
            roles: 'system_auth'
          }
        },
        {
          path: 'training',
          name: 'overview-training',
          component: () => import('@/views/training/training-project'),
          meta: {
            title: '练习项目',
            icon: 'tree2',
            roles: 'view_training_project'
          },
        }
      ]
    }, */
    /* {
      path: '/team-manager',
      component: Layout,
      redirect: 'noRedirect',
      alwaysShow: true,
      meta: {
        title: '组长工作台',
        icon: 'team-manager',
        roles: 'dept_manager'||'system_auth'
      },
      children: [{
        path: 'team-manager',
        name: 'team-manager',
        component: () =>
          import('@/views/team-manager'),
        meta: {
          title: '任务分配',
          icon: 'team-manager',
          roles: 'dept_manager'||'system_auth'
        }
      }, {
        path: 'statistic-manager',
        name: 'statistic-manager',
        component: () =>
          import('@/views/team-manager/statistic-manager'),
        meta: {
          title: '数据统计',
          icon: 'statistic-manager',
          roles: 'dept_manager'||'system_auth'
        }
      }, {
        path: 'remember-time',
        name: 'remember-time',
        component: () =>
          import('@/views/team-manager/memberTime'),
        meta: {
          title: '人员工时',
          icon: 'statistic-manager',
          roles: 'dept_manager'||'system_auth'
        }
      }]
    }, */
    /* {
      path: '/mine',
      component: Layout,
      redirect: 'noRedirect',
      meta: {
        title: '我的工作台',
        icon: 'task'
      },
      children: [
        {
          path: 'task',
          name: 'my-task',
          component: () => import('@/views/task'),
          meta: {
            title: '我的任务',
            icon: 'task'
          }
        },
        {
          path: 'production',
          name: 'my-production',
          component: () => import('@/views/production'),
          meta: {
            title: '我的作品',
            icon: 'pd'
          }
        },
        {
          path: 'man-hour',
          name: 'man-hour',
          component: () => import('@/views/man-hour'),
          meta: {
            title: '我的工时',
            icon: 'fs',
            roles: 'system_auth'
          }
        },
        {
          path: 'out-task',
          name: 'out-task',
          component: () => import('@/views/out-task'),
          meta: {
            title: '外包任务',
            icon: 'outTask'
          }
        }
      ]
      // }, {
      //   path: 'man-feedback',
      //   name: 'man-feedback',
      //   component: () =>
      //     import('@/views/feedBack'),
      //   meta: {
      //     title: '我的反馈',
      //     icon: 'fs'
      //   }
      // }]
    }, */
    /* {
      path: '/task',
      component: Layout,
      redirect: 'noRedirect',
      meta: {
        title: '审批',
        icon: 'task',
        roles: 'manage_approve'
      },
      children: [
        {
          path: 'approve',
          name: 'approve',
          component: () => import('@/views/video/my-audit'),
          meta: {
            title: '我的审批',
            icon: 'v2',
            roles: 'manage_approve'
          }
        },
        {
          path: 'audit-approve',
          name: 'audit-approve',
          component: () => import('@/views/video/extra-audit'),
          meta: {
            title: '客户审批',
            icon: 'v2',
            roles: 'manage_approve'
          }
        },
        {
          path: 'dailies',
          name: 'dailies',
          component: () => import('@/views/video/dailies'),
          meta: {
            title: 'To Dailies',
            icon: 'v2'
            // roles: 'manage_approve'
          }
        },

        {
          path: '/check-video',
          name: 'check-video',
          component: () => import('@/views/video/video-check'),
          meta: {
            title: '审核意见',
            activeMenu: '/task/approve'
          },
          hidden: true
        }
      ]
    }, */
    {
      path: '/search-kpi',
      component: Layout,
      redirect: 'noRedirect',
      meta: {
        title: 'kpi',
        icon: 'KPI'
      },
      children: [
        {
          path: 'search-kpi',
          name: 'search-kpi',
          component: () => import('@/views/search-kpi'),
          meta: {
            title: '人员kpi',
            icon: 'KPI'
          }
        },
        {
          path: 'department-kpi',
          name: 'department-kpi',
          component: () => import('@/views/search-kpi/department-kpi'),
          meta: {
            title: '部门kpi',
            icon: 'KPI'
          }
        },
        {
          path: 'dept-manwork',
          name: 'dept-manwork',
          component: () => import('@/views/search-kpi/dept-manwork'),
          meta: {
            title: '部门工时概览',
            icon: 'KPI'
          }
        }
      ]
    },
    {
      path: '/checking-in',
      component: Layout,
      redirect: 'noRedirect',
      alwaysShow: true,
      meta: {
        title: '考勤管理',
        icon: 'kq',
        roles: 'system_auth'
      },
      children: [
        {
          path: 'extra-work',
          name: 'extra-work',
          component: () => import('@/views/checking-in/extra-work'),
          meta: {
            title: '加班申请',
            icon: 'jiaban',
            roles: 'system_auth'
          }
        },
        {
          path: 'view-extra-work',
          name: 'view-extra-work',
          component: () => import('@/views/checking-in/view-extra-work'),
          meta: {
            title: '加班查看',
            icon: 'jbck',
            roles: 'system_auth'
          }
        },
        {
          path: 'approve-extra-work',
          name: 'approve-extra-work',
          component: () => import('@/views/checking-in/approve-extra-work'),
          meta: {
            title: '加班审批',
            icon: 'jbsp',
            roles: 'system_auth'
          }
        },
        {
          path: 'manage-work',
          name: 'manage-work',
          component: () => import('@/views/checking-in/manage-work'),
          meta: {
            title: '工时管理',
            icon: 'team-manager',
            roles: 'system_auth'
          }
        },
        {
          path: 'clock-in',
          name: 'clock-in',
          component: () => import('@/views/checking-in/clock-in'),
          meta: {
            title: '打卡管理',
            icon: 'daka',
            roles: 'system_auth'
          }
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
      children: [
        {
          path: 'material',
          name: 'material',
          component: () => import('@/views/material'),
          meta: {
            title: '素材库',
            icon: 'material'
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
      children: [
        {
          path: 'sharefiles',
          name: 'sharefiles',
          component: () => import('@/views/sharefiles'),
          meta: {
            title: '共享文件',
            icon: 'list'
          }
        }
        // ,
        // {
        //   path: 'transcoding-video',
        //   name: 'transcoding-video',
        //   component: () =>
        //     import('@/views/sharefiles/transcoding-video'),
        //   meta: {
        //     title: '视频解码',
        //     icon: 'v2'
        //   }
        // },
      ]
    },
    {
      path: '/plugin',
      component: Layout,
      redirect: 'noRedirect',
      meta: {
        title: '插件',
        icon: 'assets'
      },
      children: [
        {
          path: 'plugin',
          name: 'plugin',
          component: () => import('@/views/plugin'),
          meta: {
            title: '插件管理',
            icon: 'assets'
          }
        }
      ]
    },
    {
      path: '/admin',
      component: Layout,
      redirect: 'noRedirect',
      meta: {
        title: '系统设置',
        icon: 'settings',
        roles: 'system_auth'
      },
      children: [
        {
          path: 'profession',
          name: 'profession',
          component: () => import('@/views/admin/userGroup'),
          meta: {
            title: '用户',
            icon: 'group',
            roles: 'system_auth'
          }
        },
        {
          path: 'userGroup',
          name: 'UserGroup',
          component: () => import('@/views/admin/profession'),
          meta: {
            title: '部门及工种',
            icon: 'profession',
            roles: 'system_auth'
          }
        },
        {
          path: 'roles',
          name: 'UserGqqqroup',
          component: () => import('@/views/admin/roles'),
          meta: {
            title: '角色管理',
            icon: 'role',
            roles: 'manage_role'||'system_auth'
          }
        },
        {
          path: 'bind',
          name: 'settings',
          component: () => import('@/views/admin/bind'),
          meta: {
            title: '绑定',
            icon: 'bangding',
            roles: 'system_auth'
          }
        },
        {
          path: 'attrs',
          name: 'customAttrs',
          component: () => import('@/views/admin/customAttrs'),
          meta: {
            title: '自定义属性',
            icon: 'custom-attrs',
            roles: 'system_auth'
          }
        },
        {
          path: 'time-management',
          name: 'time-management',
          component: () => import('@/views/admin/time-management'),
          meta: {
            title: '时间管理',
            icon: 'fs',
            roles: 'system_auth'
          }
        },
        {
          path: 'extra-approve',
          name: 'extra-approve',
          component: () => import('@/views/checking-in/extra-approve'),
          meta: {
            title: '加班审批模板',
            icon: 'extra-approve',
            roles: 'system_auth'
          }
        },
        {
          path: 'menu',
          name: 'menu',
          component: () => import('@/views/admin/menu'),
          meta: {
            title: '考勤时间设置',
            icon: 'menu',
            roles: 'system_auth'
          }
        }
      ]
    },
    {
      // 404必须在最后面
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]
}
