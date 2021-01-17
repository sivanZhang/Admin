/**
 * 
 *@file 只有练习项目的权限时候用的路由
 *  
 */
import Layout from '@/layout'
export default [{
    path: '/',
    component: Layout,
    redirect: {
        name: 'overview-training'
      },
    meta: {
      title: '概览',
      icon: 'gailan'
    },
    children: [{
      path: '/overview/training',
      name: 'overview-training',
      component: () =>
        import('@/views/training/training-project'),
      meta: {
        title: '练习项目',
        icon: 'tree2'
      },
    }]
  },
  { // 404必须在最后面
    path: '*',
    redirect: '/404',
    hidden: true
  },
]
