import { map } from 'lodash';
import { ref } from 'vue';
import { ColumnAlign, type TableOptions } from '#/components/Crud/types/table';
import { type ColumnOption } from '#/components/Crud/types/table';

import {
  InputValue,
  SearchItemBuild,
  SearchParam,
  SearchParamBuild,
  SelectValue,
  DateRangeValue,
} from '#/components/Crud/models/search';
import { DateValueType } from '#/components/Crud/types/search';
import { dayAgoDate, getUuid } from '#/utils/global';
import {
  FixAlign,
  type DisplayFieldDisabled,
} from '#/components/Crud/types/table';

import {
  getPublisherOptions,
  getUserOptions,
  getPartnerOptions,
  getPartnerAdUnitOptions,
  getPartnerAppOptions,
  getAdUnitOptions,
  getAppOptions,
} from '#/api/core/selectList';
export const tableOptions = (): TableOptions => {
  return {
    align: ColumnAlign.Center,
    actionWidth: 70,
    actionFixed: 'right',
    title: '角色管理',
    lazy: true,
    columns: [
      {
        prop: 'fieldName',
        label: '维度',
        minWidth: 150,
        fixed: FixAlign.Left,
        align: ColumnAlign.Left,
        hide: true,
        slot: true,
      },
      ...quotaColumn(),
    ],
    handleSummaries({ columns, data }: any): string[] {
      function sumTotal(property: string) {
        const values = data.map((item: any) => Number(item[property]));
        return values.length
          ? values.reduce(
              (previousValue: number, currentValue: number) =>
                previousValue + currentValue,
            )
          : 0;
      }

      const sumFields: string[] = [
        'adRequest',
        'adFills',
        'adImpressions',
        'adClicks',
        'adConversions',
        'adImpressions',
        'adRevenue',
        'payout',
        'profit',
      ];
      const avgFields: any[] = [
        {
          column: 'adFillRate',
          sum: [sumTotal('adFillRate'), data.length],
        },
        {
          column: 'adClickRate',
          sum: [sumTotal('adClickRate'), data.length],
        },
        {
          column: 'adConversionRate',
          sum: [sumTotal('adClickRate'), data.length], //sum: [sumTotal('revenue'), sumTotal('taskInstalls')]
        },
      ];

      const summaries: any[] = [];
      if (columns.length > 0 && data.length > 0) {
        columns.forEach((column: any, index: number) => {
          if (index === 0) {
            summaries[index] = '汇总';
            return;
          }
          if (sumFields.includes(column.property)) {
            summaries[index] = parseFloat(sumTotal(column.property).toFixed(2));
          } else {
            avgFields.forEach((item: any) => {
              if (column.property === item.column) {
                if (item.unit && item.unit === '%') {
                  summaries[index] =
                    parseFloat(((item.sum[0] / item.sum[1]) * 100).toFixed(2)) +
                    '%';
                } else {
                  summaries[index] = parseFloat(
                    (item.sum[0] / item.sum[1]).toFixed(2),
                  );
                }
              }
            });
          }
        });
      }
      return summaries;
    },
  };
};

export const quotaColumn = (): ColumnOption[] =>
  map(
    [
      {
        prop: 'date',
        label: '日期',
        minWidth: 110,
        groupby: true,
        sortable: true,
        slot: true,
      },
      {
        prop: 'publisherBdName',
        label: '渠道BD',
        minWidth: 120,
        groupby: true,
        hide: true,
      },
      {
        prop: 'publisherName',
        label: '渠道',
        minWidth: 120,
        groupby: true,
        hide: true,
      },
      {
        prop: 'appName',
        label: 'APP',
        minWidth: 120,
        groupby: true,
        hide: true,
      },
      {
        prop: 'adUnitName',
        label: '广告单元',
        minWidth: 120,
        groupby: true,
        hide: true,
      },
      {
        prop: 'partnerName',
        label: 'Partner',
        minWidth: 120,
        groupby: true,
        hide: true,
      },
      {
        prop: 'partnerAppName',
        label: 'Partner App',
        minWidth: 120,
        groupby: true,
        hide: true,
      },
      {
        prop: 'partnerAdUnitName',
        label: 'Partner AdUnit',
        minWidth: 120,
        groupby: true,
        hide: true,
      },
      {
        prop: 'countryCode',
        label: '国家',
        minWidth: 180,
        groupby: true,
        hide: true,
      },
    ],
    (i: any) => ({ ...i, uuid: getUuid() }),
  );

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
        .setApi(getUserOptions, { roleId: 106 })
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('渠道')
        .setDefault(true)
        .setPlaceholder('请选择')
        .setValue(new SelectValue('publisherId'))
        .setApi(getPublisherOptions)
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('App')
        .setDefault(true)
        .setPlaceholder('请选择')
        .setValue(new SelectValue('appId'))
        .setApi(getAppOptions)
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('Ad Unit')
        .setDefault(true)
        .setPlaceholder('请选择Ad Unit')
        .setValue(new SelectValue('adUnitId'))
        .setApi(getAdUnitOptions)
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('Partner')
        .setDefault(false)
        .setPlaceholder('请选择Partner')
        .setValue(new SelectValue('partnerId'))
        .setApi(getPartnerOptions)
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('Partner APP')
        .setDefault(false)
        .setPlaceholder('请选择Partner APP')
        .setValue(new SelectValue('partnerAppId'))
        .setApi(getPartnerAppOptions)
        .build(),
    )
    .add(
      new SearchItemBuild()
        .setLabel('Partner AdUnit')
        .setDefault(false)
        .setPlaceholder('请选择Partner AdUnit')
        .setValue(new SelectValue('partnerAdUnitId'))
        .setApi(getPartnerAdUnitOptions)
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

export const fieldGroups = () => {
  return [
    {
      label: '按天',
      prop: 'byDay',
      column: ['date', 'statDateStart', 'statDateEnd'],
      value: true,
    },
    {
      label: '按周',
      prop: 'byWeek',
      column: ['date', 'statDateStart', 'statDateEnd'],
      value: false,
    },
    {
      label: '按月',
      prop: 'byMonth',
      column: ['date', 'statDateStart', 'statDateEnd'],
      value: false,
    },
    {
      label: '按年',
      prop: 'byYear',
      column: ['date', 'statDateStart', 'statDateEnd'],
      value: false,
    },
    {
      label: '渠道BD',
      prop: 'publisherBdId',
      column: 'publisherBdName',
      value: false,
    },
    {
      label: '渠道',
      prop: 'publisherId',
      column: 'publisherName',
      value: false,
    },
    {
      label: 'App',
      prop: 'appId',
      column: 'appName',
      value: false,
    },
    {
      label: '广告单元',
      prop: 'adUnitId',
      column: 'adUnitName',
      value: false,
    },
    {
      label: 'Partner',
      prop: 'partnerId',
      column: 'partnerName',
      value: false,
    },
    {
      label: 'Partner App',
      prop: 'partnerAppId',
      column: 'partnerAppName',
      value: false,
    },
    {
      label: 'Partner AdUnit',
      prop: 'partnerAdUnitId',
      column: 'partnerAdUnitName',
      value: false,
    },
    {
      label: '国家',
      prop: 'countryCode',
      column: 'countryCode',
      value: false,
    },
  ];
};
export const dragMetricsColumns = ref<ColumnOption[]>(
  map(
    [
      {
        prop: 'adRequest',
        label: '广告请求数',
        minWidth: 180,
        sortable: true,
      },
      {
        prop: 'adFills',
        label: '广告填充数',
        minWidth: 180,
        sortable: true,
      },
      {
        prop: 'adImpressions',
        label: '广告展示数',
        minWidth: 180,
        sortable: true,
      },
      {
        prop: 'adClicks',
        label: '广告点击数',
        minWidth: 180,
        sortable: true,
      },
      {
        prop: 'adConversions',
        label: '广告转化数',
        minWidth: 180,
        sortable: true,
      },
      {
        prop: 'adFillRate',
        label: '广告填充率',
        minWidth: 180,
        sortable: true,
        percent: true,
      },
      {
        prop: 'adClickRate',
        label: '广告点击率',
        minWidth: 180,
        sortable: true,
        percent: true,
      },
      {
        prop: 'adConversionRate',
        label: '广告转化率',
        minWidth: 180,
        sortable: true,
        percent: true,
      },
      {
        prop: 'adRevenue',
        label: '广告收益($)',
        minWidth: 180,
        sortable: true,
      },
      {
        prop: 'payout',
        label: '支出',
        minWidth: 180,
      },
      {
        prop: 'profit',
        label: '利润',
        minWidth: 180,
      },
      // {
      //   prop: 'profit2',
      //   label: '利润2',
      //   minWidth: 180,
      //   metricsKeys: '1',
      // },
      // {
      //   prop: 'payout2',
      //   label: '支出2',
      //   minWidth: 180,
      //   metricsKeys: '1',
      // },
    ],
    (i: ColumnOption) => ({ ...i, uuid: getUuid() }),
  ),
);

export const displayFieldDisabled = (): DisplayFieldDisabled[] => {
  return [];
};
