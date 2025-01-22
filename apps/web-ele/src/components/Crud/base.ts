import {
  type TableOptions,
  type PaginationParams,
  type SortParams,
  type BaseCrudServerConstructor,
  type DisplayField,
} from './types/table';
import {
  createEmptyTableOptions,
  createDefPaginationParams,
  createEmptySortParams,
  createEmptySearchParam,
} from './config';
import { SearchParam } from '#/components/Crud/models/search';
import {
  formatDate,
  formatHour,
  getStartOrEnd,
  timestamp,
  debounce,
} from '#/utils/global';
import { shallowRef, ref, computed, watch } from 'vue';
import { cloneDeep } from '@vben/utils';

export class BaseCrudService {
  constructor({
    tableOptions,
    searchOption,
    sortParams,
    fieldGroup,
    fetchTableDataList,
    fetchSelectOptions,
  }: BaseCrudServerConstructor) {
    this.tableOptions.value = tableOptions;
    searchOption && (this.searchParam.value = searchOption);
    sortParams && (this.sortParams.value = sortParams);
    fieldGroup && (this.fieldGroup.value = fieldGroup);
    this.initShowfields();
    this.getTreeDefaultFields();
    this.fetchTableDataList = fetchTableDataList;
    this.getTableData();
    fetchSelectOptions?.();

    watch(
      () => this.paginationParams.value,
      (paginationParams: PaginationParams) => {
        this.debounced(() => {
          this.getTableData();
        });
      },
      { immediate: false, deep: true },
    );
  }

  public fetchTableDataList = async (searchParam: any) => {};
  public tableDataLoading = shallowRef<boolean>(false);
  public tableData = ref<Record<string, any>[]>([]);
  public tableDataTotal = ref<number>(0);
  public tableOptions = ref<TableOptions>(createEmptyTableOptions());
  public searchParam = ref<SearchParam>(createEmptySearchParam());

  // 分页参数
  public paginationParams = ref<PaginationParams>(createDefPaginationParams());
  // 排序参数
  public sortParams = ref<SortParams>(createEmptySortParams());

  // 额外的附加搜索参数
  public extraParams = shallowRef<Record<string, any>>({});
  // 显示的字段(指标或维度,适用于报表)
  public showfields = ref<string>('');

  // 选择的数据行
  public selectedRows = ref<any[]>([]);
  public treeSearchParams = ref<Record<string, any>>({});
  public treeSelectedFields = ref<any[]>([]);
  public treeDefaultFields = ref<any[]>([]);
  public fieldGroup = ref<any[]>([]);
  public fieldsMul = shallowRef<boolean>(true);
  public fieldsCurrent = ref<any[]>([]);

  public displayFields = computed((): DisplayField[] => {
    return this.tableOptions.value.columns.map((item: any) => {
      return {
        prop: item.prop,
        label: item.label,
        column: item.column,
        value: item.hide === 'undefined' || !item.hide,
      };
    });
  });

  private queryParams = computed((): any => {
    const params: any = {
      // 搜索参数
      ...this.searchParam.value.Params,
      // 分页参数
      ...this.paginationParams.value,
      // 排序参数
      ...this.sortParams.value,
      // 额外附加参数
      ...this.extraParams.value,
    };

    if (!this.fieldsMul.value) {
      this.fieldsCurrent.value = this.treeSelectedFields.value;
      params.fields = this.treeSelectedFields.value[0];
      if (params.fields.includes('hour')) {
        params.fields = 'date,' + params.fields;
      }
    } else {
      if (this.showfields.value) {
        this.fieldsCurrent.value = this.showfields.value.split(',');
        params.fields = this.showfields.value;
        if (params.fields.includes('hour')) {
          params.fields = 'date,' + params.fields;
        }
      }
    }

    if (params.descs?.includes('hour')) {
      let curIndex = params.descs.findIndex((item: any) => item === 'hour');
      params.descs[curIndex] = 'date';
    } else if (params.ascs?.includes('hour')) {
      let curIndex = params.ascs.findIndex((item: any) => item === 'hour');
      params.ascs[curIndex] = 'date';
    }

    if (
      params.fields &&
      !params.fields.includes('date') &&
      !params.fields.includes('hour')
    ) {
      params.ascs =
        params.ascs && params.ascs.filter((item: any) => item !== 'date');
      params.descs =
        params.descs && params.descs.filter((item: any) => item !== 'date');
    }

    return params;
  });

  public getTableData = async () => {
    this.tableDataLoading.value = true;
    try {
      const { records, total }: any = await this.fetchTableDataList?.(
        cloneDeep(this.queryParams.value),
      );
      this.tableData.value = records;
      this.tableDataTotal.value = total;

      if (!this.fieldsMul.value) {
        let groupbyLen =
          this.treeSelectedFields.value.length -
          (this.treeDefaultFields.value.length ? 1 : 0);

        this.tableData.value.forEach((item: any, index: number) => {
          item.fieldName = this.treeSelectedFields.value[0];
          item.keyid = String(index) + new Date().getTime();
          item.fieldsLen = groupbyLen; // groupby筛选项长度
          item.hasChildren = !!groupbyLen;
        });
      }
    } catch (error) {
      this.tableData.value = [];
      this.tableDataTotal.value = 0;
    } finally {
      this.tableDataLoading.value = false;
    }
  };

  public reloadTableData = () => {
    // 重置当前页为第一页
    this.paginationParams.value.current = 1;
    // 重新拉取数据
    this.getTableData();
  };

  searchValueChange = () => {
    setTimeout(() => {
      this.reloadTableData();
    }, 0);
  };

  initShowfields = () => {
    this.showfields.value = this.fieldGroup?.value
      .filter((item: any) => item.value)
      .map((item: any) => item.prop)
      .join(',');
  };

  onDisplayFieldValueChange = (fields: string) => {
    this.showfields.value = fields;
    this.reloadTableData();
  };

  onSortChange = (sortParams: SortParams) => {
    this.sortParams.value = sortParams;
    // 当排序参数发生改变时, 需要重置当前页为第一页
    // 重新拉取数据
    this.reloadTableData();
  };

  getTreeDefaultFields = () => {
    this.treeDefaultFields.value = this.fieldGroup.value.filter(
      (item: any) => item.value,
    );
    this.treeSelectedFields.value = this.treeDefaultFields.value.map(
      (item: any) => item.prop,
    );
  };

  getTreeField = (row: any) => {
    let fieldNameItem: any = this.fieldGroup.value.find(
      (ele: any) => ele.prop === row.fieldName,
    );

    if (fieldNameItem) {
      if (
        row[fieldNameItem.column[0]] &&
        ['date', 'byDay', 'byWeek', 'byMonth', 'byYear'].includes(row.fieldName)
      ) {
        const customFormatMap: any = {
          date: 'YYYY-MM-DD HH:mm:ss',
          byDay: 'YYYY-MM-DD',
          byWeek: 'YYYY-MM-DD',
          byMonth: 'YYYY-MM',
          byYear: 'YYYY',
        };
        return formatDate(
          row[fieldNameItem.column[0]],
          customFormatMap[row.fieldName],
        );
      } else if (row[fieldNameItem.column[0]] && row.fieldName === 'hour') {
        return formatHour(row[fieldNameItem.column[0]]);
      } else {
        return row[fieldNameItem.column];
      }
    }
  };

  onLoadTreeChange = async (
    tree: any,
    _: any,
    resolve: (data: Record<string, any>[]) => void,
  ): Promise<void> => {
    this.treeSearchParams.value = {};

    let fieldNameIndex = this.treeSelectedFields.value.findIndex(
      (item: any) => item === tree.fieldName,
    );

    let fields = this.treeSelectedFields.value.filter(
      (_: any, index: number) => index <= fieldNameIndex + 1,
    );

    this.fieldGroup.value.forEach((item: any) => {
      if (tree[item.column[0]]) {
        if (this.fieldsCurrent.value.includes(item.prop)) {
          this.treeSearchParams.value[item.column[1]] = timestamp(
            getStartOrEnd(item.prop, tree[item.column[0]], 'start'),
          );
          this.treeSearchParams.value[item.column[2]] = timestamp(
            getStartOrEnd(item.prop, tree[item.column[0]], 'end'),
          );
        }
      } else {
        this.treeSearchParams.value[item.prop] = tree[item.prop];
      }
    });

    let hourItem = this.fieldGroup.value.find(
      (item: any) => item.prop === 'hour',
    );

    if (hourItem && fields.includes('hour') && fields.length >= 2) {
      this.treeSearchParams.value[hourItem.column[1]] =
        tree[hourItem.column[0]];
      this.treeSearchParams.value[hourItem.column[2]] =
        tree[hourItem.column[0]];
    }

    const req = {
      ...cloneDeep(this.queryParams.value),
      fields: fields.join(','),
      ...this.treeSearchParams.value,
      size: 1000,
    };

    const { records }: any = await this.fetchTableDataList(req);
    records.forEach((item: any, index: number) => {
      item.fieldName =
        this.treeSelectedFields.value[
          this.treeSelectedFields.value.length - tree.fieldsLen
        ];
      item.keyid =
        tree.keyid.slice(0, 1) + String(index) + new Date().getTime();
      item.fieldsLen = tree.fieldsLen - 1;
      item.hasChildren = item.fieldsLen > 0;
    });
    return resolve(records);
  };

  private debounced = debounce((execute: Function) => {
    execute();
  }, 100);

  public setExtraParams = (extraParams: any) => {
    this.extraParams.value = extraParams;
  };

  onSelectionChange = (selectedRows: any[]) => {
    this.selectedRows.value = selectedRows;
  };
}
