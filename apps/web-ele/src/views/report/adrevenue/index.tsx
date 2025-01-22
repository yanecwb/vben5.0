import { defineComponent, computed } from 'vue';
import { Page } from '@vben/common-ui';
import Crud from '#/components/Crud/index.vue';
import { ElTooltip } from 'element-plus';
import Metrics from '#/components/Metrics/index.vue';
import Groupby from '#/components/Metrics/components/Lgroupby/index.vue';
import GroupbyMul from '#/components/Metrics/components/Lgroupby/mul/index.vue';
import { cloneDeep } from 'lodash';
import { BaseCrudService } from '#/components/Crud/base';

import {
  tableOptions,
  searchOption,
  fieldGroups,
  dragMetricsColumns,
  displayFieldDisabled,
} from './config';
import { taskRevenueReportApi } from './service';
import dayjs from 'dayjs';
import { getUuid } from '#/utils/global';
import { type ColumnOption } from '#/components/Crud/types/table';

export default defineComponent({
  name: 'adrevenue',
  setup() {
    const {
      tableDataLoading,
      tableOptions: top,
      tableDataTotal,
      tableData,
      searchParam,
      paginationParams,
      fieldsCurrent,
      fieldGroup,
      fieldsMul,
      treeSelectedFields,
      reloadTableData,
      onDisplayFieldValueChange,
      searchValueChange,
      getTreeField,
      getTreeDefaultFields,
      initShowfields,
      onLoadTreeChange,
      onSortChange,
    } = new BaseCrudService({
      tableOptions: tableOptions(),
      searchOption: searchOption(),
      sortParams: { descs: ['date'], ascs: [] },
      fieldGroup: fieldGroups(),
      fetchTableDataList: async (initSearchParam) => {
        console.log('initSearchParam', initSearchParam);

        initSearchParam.dimensions = initSearchParam.fields;
        const { records, total } = await taskRevenueReportApi({
          metrics:
            'ad_request,ad_fills,ad_impressions,ad_clicks,ad_conversions,ad_revenue,payout,profit,ad_fill_rate,ad_click_rate,ad_conversion_rate',
          ...initSearchParam,
          statDateStart:
            initSearchParam.statDateStart &&
            dayjs(initSearchParam.statDateStart).format('YYYY-MM-DD'),
          statDateEnd:
            initSearchParam.statDateEnd &&
            dayjs(initSearchParam.statDateEnd).format('YYYY-MM-DD'),
        });
        return new Promise((resolve) => {
          resolve({ records, total });
        });
      },
      fetchSelectOptions: () => {},
    });
    // const actions = [{ command: 'fieldType', label: '维度样式切换' }];

    const dynamischTableOptions = computed(() => {
      const tps = cloneDeep(top.value);
      tps.columns.push(...dragMetricsColumns.value);
      tps.columns.forEach((i: ColumnOption) => {
        i.uuid = getUuid();
      });
      return tps;
    });

    const changeMetrics = (updatedColumns: any) => {
      dragMetricsColumns.value = updatedColumns;
    };

    const onFieldsMulChange = (event: any[], selectedFieldGroup: any[]) => {
      event.forEach((ele: any) => {
        const searchIndex = top.value.columns.findIndex(
          (item: ColumnOption) => {
            if (typeof ele.column === 'string') {
              return item.prop === ele.column;
            } else {
              return item.prop === ele.prop;
            }
          },
        );
        if (searchIndex > -1) {
          const columnItem = top.value.columns[searchIndex] as ColumnOption;
          columnItem.hide = !ele.value;
          top.value.columns[searchIndex] = columnItem;
        }
      });
      onDisplayFieldValueChange(selectedFieldGroup.join(','));
    };

    const onFieldsValueChange = (fields: any[]) => {
      treeSelectedFields.value = fields;
      reloadTableData();
    };

    const handleChangeMul = () => {
      if (fieldsMul.value) {
        fieldsMul.value = false;
        fieldGroup.value = fieldGroups();
        getTreeDefaultFields();
        let propList = fieldGroup.value.map((item: any) => {
          return typeof item.column === 'string' ? item.column : item.prop;
        });
        top.value.columns.forEach((item: any) => {
          if (propList.includes(item.prop)) {
            item.hide = true;
          }
          if (item.prop === 'fieldName') {
            item.hide = false;
          }
          if (item.prop === 'date') {
            item.hide = fieldsCurrent.value.some((f: string) => {
              if (['date', 'byDay', 'byWeek', 'byMonth', 'byYear'].includes(f))
                return true;
            });
          }
        });
      } else {
        fieldsMul.value = true;
        initShowfields();
        top.value = tableOptions();
      }
      reloadTableData();
    };

    return () => (
      <Page>
        <Crud
          searchParam={searchParam.value}
          tableDataLoading={tableDataLoading.value}
          tableOptions={dynamischTableOptions.value}
          tableData={tableData.value}
          tableDataTotal={tableDataTotal.value}
          paginationParams={paginationParams.value}
          onLoad={onLoadTreeChange}
          onSearchValueChange={searchValueChange}
          onSortChange={onSortChange}
        >
          {{
            'groupby-metrics': () => (
              <div>
                <div class="relative pr-5">
                  <span
                    class="icon-[tabler--arrows-exchange-2] absolute right-0 cursor-pointer text-[#2265ff]"
                    title="切換維度樣式"
                    onClick={handleChangeMul}
                  ></span>
                  {fieldsMul.value ? (
                    <GroupbyMul
                      fields={fieldGroup.value}
                      displayFieldDisabled={displayFieldDisabled()}
                      onFieldsMulChange={onFieldsMulChange}
                    ></GroupbyMul>
                  ) : (
                    <Groupby
                      fields={fieldGroup.value}
                      displayFieldDisabled={displayFieldDisabled()}
                      onFieldsChange={onFieldsValueChange}
                    ></Groupby>
                  )}
                </div>
                <Metrics
                  dragMetricsColumns={dragMetricsColumns.value}
                  fieldGroup={fieldGroup.value}
                  fieldsCurrent={fieldsCurrent.value}
                  columnsFilterOptions={[
                    { label: '基础细分' },
                    { label: '其他', metricsKeys: '1' },
                  ]}
                  onChange={changeMetrics}
                ></Metrics>
              </div>
            ),
            date: ({ row }: { row: any }) => <span>{row.date}</span>,
            fieldName: ({ row }: { row: any }) => (
              <span>
                <ElTooltip content={row.fieldName} placement="top-start">
                  {getTreeField(row)}
                </ElTooltip>
              </span>
            ),
          }}
        </Crud>
      </Page>
    );
  },
});
