import { ColumnAlign, type TableOptions } from '#/components/Crud/types/table';
import {
  InputValue,
  SearchItemBuild,
  SearchParam,
  SearchParamBuild,
  SelectValue,
  DateRangeValue,
  MultiSelectValue,
} from '#/components/Crud/models/search';
import { DateValueType } from '#/components/Crud/types/search';
import { dayAgoDate, formatDateTime } from '#/utils/global';
import { queryRoles } from './service';
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
        .setLabel('日期')
        .setDefault(true)
        .setPlaceholder('请选择')
        .setValue(
          new DateRangeValue(
            'date',
            ['statDateStart', 'statDateEnd'],
            [dayAgoDate(6), dayAgoDate(0)],
            DateValueType.String,
            false,
          ),
        )
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('国家')
        .setDefault(false)
        .setPlaceholder('请输入')
        .setValue(new InputValue('countryCode'))
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('渠道BD')
        .setDefault(false)
        .setPlaceholder('请选择')
        .setValue(new SelectValue('publisherBdId'))
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('渠道')
        .setDefault(true)
        .setPlaceholder('请选择')
        .setValue(new SelectValue('publisherId'))
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('App')
        .setDefault(true)
        .setPlaceholder('请选择')
        .setValue(new SelectValue('appId'))
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('Ad Unit')
        .setDefault(true)
        .setPlaceholder('请选择Ad Unit')
        .setValue(new SelectValue('adUnitId'))
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('Partner')
        .setDefault(false)
        .setPlaceholder('请选择Partner')
        .setValue(new SelectValue('partnerId'))
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('Partner APP')
        .setDefault(false)
        .setPlaceholder('请选择Partner APP')
        .setValue(new MultiSelectValue('partnerAppId'))
        .setApi(queryRoles)
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('Partner AdUnit')
        .setDefault(false)
        .setPlaceholder('请选择Partner AdUnit')
        .setValue(new SelectValue('partnerAdUnitId'))
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
