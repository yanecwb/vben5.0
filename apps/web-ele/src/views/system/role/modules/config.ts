import { type VbenFormSchema } from '#/adapter/form';

export const initSchema:VbenFormSchema[] = [
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
      placeholder: '请输入角色名称',
    },
    rules: 'required',
    fieldName: 'name',
    label: '角色名称',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入标识',
    },
    rules: 'required',
    fieldName: 'code',
    label: '标识',
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
