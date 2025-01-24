import { type VbenFormSchema } from '#/adapter/form';

export const initSchema = (showParent=true):VbenFormSchema[] => [
  {
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    fieldName: 'parentId',
    label: '父级',
    dependencies: {
      triggerFields: ['name'],
      show: showParent,
    },
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入标题',
    },
    fieldName: 'name',
    label: '标题',
    rules:'required'
  },
  {
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: '菜单',
          value: 1,
        },
        {
          label: '按钮',
          value: 2,
        },
      ],
    },
    defaultValue: 1,
    fieldName: 'type',
    label: '类型',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入菜单排序',
    },
    fieldName: 'orderNum',
    label: '排序',
    rules:'required'
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入图标',
    },
    fieldName: 'icon',
    label: '图标',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入菜单路径',
    },
    fieldName: 'href',
    label: '菜单路径',
    rules:'required'
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入组件路径',
    },
    fieldName: 'component',
    label: '组件路径',
    rules:'required'
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入权限标识',
    },
    fieldName: 'resource',
    label: '权限标识',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入描述',
      type: 'textarea',
    },
    fieldName: 'description',
    label: '描述',
  },
]
