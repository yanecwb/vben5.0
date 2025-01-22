import { ColumnAlign, type TableOptions } from '#/components/Crud/types/table';
import {
  InputValue,
  SearchItemBuild,
  SearchParam,
  SearchParamBuild,
} from '#/components/Crud/models/search';
import { formatDateTime } from '#/utils/global';
export const tableOptions = (): TableOptions => {
  return {
    menu: true,
    align: ColumnAlign.Center,
    actionWidth: 40,
    columns: [
      {
        prop: 'id',
        label: 'ID',
        minWidth: 20,
      },
      {
        prop: 'name',
        label: '角色名称',
        minWidth: 100,
      },
      {
        prop: 'code',
        label: '角色标识',
        minWidth: 150,
      },
      {
        prop: 'description',
        label: '描述信息',
        minWidth: 150,
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: 100,
        formatter: (row: Record<string, any>): string =>
          formatDateTime(row.createdTime),
      },
    ],
  };
};

export const searchOption = (): SearchParam => {
  return new SearchParamBuild()
    .setShowMoreFilterBtn(false)
    .add(
      new SearchItemBuild()
        .setLabel('角色名称')
        .setDefault(true)
        .setPlaceholder('请输入')
        .setValue(new InputValue('name'))
        .build(),
    )
    .build();
};
export function initFormOptions() {
  return {
    title: '角色',
    dialogWidth: '600px',
    labelWidth: '80px',
    type: 'create',
    formItems: [
      {
        label: '角色名称',
        key: 'name',
        formType: 'Input',
        value: '',
        placeholder: '请输入角色名称',
        rules: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      },
      {
        label: '标识',
        key: 'code',
        formType: 'Input',
        value: '',
        placeholder: 'e.g: ROLE_ADMIN',
        rules: [{ required: true, message: '请输入标识', trigger: 'blur' }],
      },
      {
        label: '简介',
        key: 'description',
        formType: 'Textarea',
        value: '',
        placeholder: '请输入简介信息',
      },
    ],
  };
}
