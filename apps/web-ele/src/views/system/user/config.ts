import {
  InputValue,
  SearchItemBuild,
  SearchParam,
  SearchParamBuild,
  SelectValue,
} from '#/components/Crud/models/search';
import {
  ColumnAlign,
  type TableOptions,
  type TagOption,
} from '#/components/Crud/types/table';
import { TAG_DEFAULT } from '#/constant/global';
import { formatDateTime } from '#/utils/global';
import { getRoleOptions } from '#/api/core/selectList';

export const UserStatus = {
  Normal: 1,
  Locked: 2,
};

// 类型
export const StatusOptions = [
  { label: '正常', value: UserStatus.Normal, class: TAG_DEFAULT.Primary },
  { label: '锁定', value: UserStatus.Locked, class: TAG_DEFAULT.Danger },
];

export const tableOptions = (): TableOptions => {
  return {
    menu: true,
    title: '员工管理',
    align: ColumnAlign.Center,
    actionWidth: 80,
    columns: [
      {
        prop: 'id',
        label: 'ID',
        minWidth: 60,
      },
      {
        prop: 'username',
        label: '用户名',
        minWidth: 100,
      },
      {
        prop: 'nickname',
        label: '昵称',
        minWidth: 100,
      },
      {
        prop: 'email',
        label: '邮箱',
        minWidth: 160,
      },
      {
        prop: 'phoneNumber',
        label: '手机号',
        minWidth: 100,
      },
      {
        prop: 'roles',
        label: '角色',
        minWidth: 100,
        slot: true,
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: 80,
        tagFormatter: (row: any): TagOption | undefined => {
          return StatusOptions.find((item: any) => item.value === row.status);
        },
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: 160,
        formatter: (row: any) => {
          return formatDateTime(row.createdTime);
        },
      },
    ],
  };
};

export const searchOption = (): SearchParam => {
  return new SearchParamBuild()
    .setShowMoreFilterBtn(true)
    .add(
      new SearchItemBuild()
        .setLabel('用户名')
        .setDefault(true)
        .setPlaceholder('请输入')
        .setValue(new InputValue('username'))
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('昵称')
        .setDefault(false)
        .setPlaceholder('请输入')
        .setValue(new InputValue('nickname'))
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('手机号')
        .setDefault(true)
        .setPlaceholder('请输入')
        .setValue(new InputValue('phoneNumber'))
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('Email')
        .setDefault(false)
        .setPlaceholder('请输入')
        .setValue(new InputValue('email'))
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('角色')
        .setDefault(false)
        .setPlaceholder('请选择')
        .setValue(new SelectValue('roleId'))
        .setApi(getRoleOptions)
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('状态')
        .setDefault(false)
        .setPlaceholder('请选择')
        .setValue(new SelectValue('status', '', StatusOptions))
        .build(),
    )
    .build();
};
