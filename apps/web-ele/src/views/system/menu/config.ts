import { type Menu, MenuCagegory, MenuType, type Permission } from './type';

export const addMenuTypeMap = {
  editMenu: {
    text: '编辑',
  },
  addNextMenu: {
    text: '新增下级',
  },
  addSameMenu: {
    text: '新增同级',
  },
};
export const createEmptyMenu = (): Menu => {
  return {
    id: 0,
    parentId: 0,
    // 1:菜单 2:按钮 3:不可点击菜单 4:不可点击按钮 5:第三方app 6:数据权限
    type: MenuType.Menu,
    name: '',
    href: '',
    component: '',
    icon: '',
    keepalive: 0,
    resource: '',
    orderNum: 1,
    description: '',
    children: [],
  };
};

export const createEmptyPermission = (): Permission => {
  return {
    id: 0,
    typeName: 'action',
    name: '',
    resource: '',
    category: MenuCagegory.UserPlatform,
  };
};

export const permissionTypeOptions = [
  {
    label: '是否显示',
    options: [
      {
        label: '内容(是否显示)',
        value: 'content',
      },
      {
        label: '动作(是否显示)',
        value: 'action',
      },
      {
        label: '列表字段&过滤(是否显示)',
        value: 'filter_and_column',
      },
      {
        label: '列表过滤条件(是否显示)',
        value: 'filter',
      },
      {
        label: '列表字段(是否显示)',
        value: 'column',
      },
    ],
  },
  {
    label: '是否允许操作',
    options: [
      {
        label: '动作(是否允许操作)',
        value: 'disable_action',
      },
    ],
  },
  {
    label: '数据权限',
    options: [
      {
        label: '数据权限',
        value: 'data_permission',
      },
    ],
  },
];
