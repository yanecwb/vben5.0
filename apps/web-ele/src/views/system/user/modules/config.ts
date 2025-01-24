import { type VbenFormSchema } from '#/adapter/form';
import { getRoleOptions } from '#/api/core/selectList';
export const initSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    label: 'id',
    fieldName: 'id',
    dependencies: {
      triggerFields: ['name'],
      show: false,
    },
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入用户名',
    },
    rules: 'required',
    fieldName: 'username',
    label: '用户名',
  },
  {
    label: '昵称',
    fieldName: 'nickname',
    component: 'Input',
    componentProps: {
      placeholder: '请输入昵称',
    },
    rules: 'required',
  },
  {
    label: '邮箱',
    fieldName: 'email',
    component: 'Input',
    componentProps: {
      placeholder: '请输入邮箱',
      type: 'email',
    },
    rules: 'required',
  },
  {
    label: '密码',
    fieldName: 'password',
    component: 'Input',
    componentProps: {
      placeholder: '请输入密码',
      type: 'password',
    },
    rules: 'required',
  },
  {
    label: '手机号',
    fieldName: 'phoneNumber',
    component: 'Input',
    componentProps: {
      placeholder: '请输入手机号',
    },
    rules: 'required',
  },
  {
    label: '角色',
    fieldName: 'roleIds',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择角色',
      multiple: true,
      api: getRoleOptions,
    },
    rules: 'required',
  },
  {
    label: '状态',
    fieldName: 'status',
    component: 'Switch',
    componentProps: {
      class: 'w-auto',
    },
    defaultValue:true
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入简介信息',
      type: 'textarea',
    },
    fieldName: 'description',
    label: '简介信息',
  },
];
