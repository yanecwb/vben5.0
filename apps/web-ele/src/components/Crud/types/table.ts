import type { ColumnCls } from 'element-plus';
import { SearchParam } from '#/components/Crud/models/search';

export const enum ColumnAlign {
  Left = 'left',
  Right = 'right',
  Center = 'center',
}

export const enum FixAlign {
  Left = 'left',
  Right = 'right',
}

export interface TagOption {
  class: string;
  label: string;
  value: string | number;
}

export interface ImageOption {
  url: string;
  urlList?: string[];
  style: string;
}

export interface ColumnOption {
  // 对应列内容的字段名
  readonly prop: string;
  // 显示的标题
  readonly label: string;
  // 对应列的最小宽度
  readonly minWidth?: number;
  // 对齐方式
  readonly align?: ColumnAlign;
  readonly fixed?: FixAlign;
  readonly permission?: string;
  hide?: boolean;
  readonly slot?: boolean;
  readonly sortable?: boolean;
  readonly localSortable?: boolean;
  // 列名字段提示
  readonly tips?: string;
  readonly limitLine?: number;
  readonly metricsKeys?: string;
  formatter?(row: any): string;
  formatterValue?(value: any): string;
  tagFormatter?(row: any): TagOption | undefined;
  imageFormatter?(row: any): ImageOption;
  jsonView?: boolean;
  subdivision?: boolean;
  groupby?: boolean;
  percent?: boolean;
  custom?: string;
  list?: Array<ColumnOption>;
  sort?: number;
  uuid?: string | number;
}

export interface QuotaColumn {
  readonly prop: string;
  readonly label: string;
  readonly permission?: string;
}
export interface DisplayField {
  readonly prop: string;
  readonly label: string;
  readonly column: string;
  value: boolean;
}
export interface DisplayFieldGroup {
  readonly label: string;
  items: DisplayField[];
}
export interface DisplayFieldDisabled {
  prop: string;
  disabledList: string[];
}

export interface TableOptions {
  readonly title?: string;
  readonly menu?: boolean;
  readonly align: ColumnAlign;
  readonly selection?: boolean;
  readonly draggable?: boolean;
  readonly highlightCurrentRow?: boolean;
  readonly draggableDisabled?: (row: any, index?: number) => boolean;
  readonly lazy?: boolean;
  selectable?: (row: any, index: number) => boolean;
  handleSummaries?: ({ columns, data }: any) => string[];
  readonly columns: Array<ColumnOption>;
  readonly fontSize?: string;
  readonly tableRowClassName?: ColumnCls<string>;
  multHeader?: boolean;
  actionWidth?: number;
  actionFixed?: 'right' | 'left';
}

export interface PaginationParams {
  current: number;
  size: number;
}

export interface SortParams {
  descs: string | string[];
  ascs: string | string[];
}

export interface BaseCrudServerConstructor {
  tableOptions: TableOptions;
  searchOption?: SearchParam;
  sortParams?: SortParams;
  fieldGroup?: any[];
  fetchTableDataList: (searchParam: any) => Promise<any>;
  fetchSelectOptions?: () => void;
}
