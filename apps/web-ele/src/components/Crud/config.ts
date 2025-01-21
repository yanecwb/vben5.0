import { SearchParam, SearchParamBuild } from './models/search';
import type { PaginationParams, SortParams, TableOptions } from './types/table';
import { ColumnAlign } from './types/table';

export const createEmptyTableOptions = (): TableOptions => {
  return {
    title: 'Table',
    menu: false,
    align: ColumnAlign.Left,
    selection: false,
    columns: [],
  };
};
export const createDefPaginationParams = (): PaginationParams => {
  return { current: 1, size: 10 };
};

export const createEmptySortParams = (): SortParams => {
  return { descs: '', ascs: '' };
};

export const createEmptySearchParam = (): SearchParam => {
  return new SearchParamBuild().setShowMoreFilterBtn(false).build();
};

export const addPercentSignFormatter = (value: any): string => {
  return value + '%';
};
export const percentConvertFormatter = (value: any): string => {
  if (typeof value == 'number') {
    return (value * 100).toFixed(2) + '%';
  } else {
    return value;
  }
};
