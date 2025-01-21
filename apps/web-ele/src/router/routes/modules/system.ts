import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:settings',
      order: 99999,
      title: '系统管理',
      
    },
    name: 'System',
    path: '/sys',
    children: [
      {
        name: 'SysMenuManage',
        path: '/menu',
        component: () => import('#/views/system/menu'),
        meta: {
          // affixTab: true,
          icon: 'lucide:menu',
          title: '菜单管理',
          // authority:['管理员'],
          // menuVisibleWithForbidden: true,
        },
      },
      {
        name: 'SysRoleManage',
        path: '/role',
        component: () => import('#/views/system/role'),
        meta: {
          icon: 'lucide:user-round-pen',
          title: '角色管理',
        },
      },
      {
        name: 'SysUserManage',
        path: '/user',
        component: () => import('#/views/system/user'),
        meta: {
          icon:'lucide:users-round',
          title: '员工管理',
        },
      },
      {
        name: 'SysPermission',
        path: '/permission',
        component: () => import('#/views/system/permission'),
        meta: {
          icon: 'lucide:shield-check',
          title: '权限分配',
        },
      },
    ],
  },
];

export default routes;
