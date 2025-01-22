export interface Option {
  label: string;
  value: string | number;
}

import { hasPermission, timestamp } from '#/utils/global';

import type {
  IDateRangeValue,
  IDateTimeRangeValue,
  IDateValue,
  IInputValue,
  IMultiSelectValue,
  INumericalIntervalValue,
  ISearchValue,
  ISelectValue,
} from '../types/search';
import { DateValueType, SelectValueType } from '../types/search';
import { isEmpty } from '@vben/utils';

export class InputValue implements IInputValue {
  key: string;
  _value: string;
  onlyNumber: boolean;

  constructor(key: string, value = '', onlyNumber = false) {
    this.key = key;
    this._value = value;
    this.onlyNumber = onlyNumber;
  }

  get value(): string {
    return this._value;
  }

  set value(v: string) {
    this._value = this.onlyNumber ? v.replace(/\D+/, '') : v;
  }

  setValue(v: string) {
    this._value = v;
  }

  initValue() {
    this.value = '';
  }
}

export class NumericalIntervalValue implements INumericalIntervalValue {
  key: string;
  keys: [string, string];
  _value: string[] = [];

  constructor(keys: [string, string]) {
    this.key = `${keys[0]}_${keys[1]}`;
    this.keys = keys;
  }

  get value(): string[] {
    return this._value;
  }

  set value(v: string[]) {
    console.log('NumericalIntervalValue', v);
    this._value = v;
    // if (v[0]) this._value[0] = v[0].replace(/\D+/, '')
    // if (v[1]) this._value[1] = v[1].replace(/\D+/, '')
  }

  initValue() {
    this._value = [];
  }
}

export class SelectValue implements ISelectValue {
  key: string;
  value: string;
  options: any[] = [];
  clearable = true;
  filterable = true;
  hide = false;

  constructor(key: string, value: any = '') {
    this.key = key;
    this.value = value;
  }

  setClearable(b: boolean) {
    this.clearable = b;
  }

  setFilterable(b: boolean) {
    this.filterable = b;
  }

  setHide(b: boolean) {
    this.hide = b;
  }

  setOptions(options: any[]) {
    this.options = options;
  }

  setValue(v: string) {
    this.value = v;
  }

  get ValueLabel(): string {
    console.log(this.options, this.value);
    // eslint-disable-next-line eqeqeq
    const item = this.options.find((item) => item.value == this.value);
    return item ? item.label : '';
  }

  initValue() {
    this.value = '';
  }
}

export class MultiSelectValue implements IMultiSelectValue {
  key: string;
  value: any[];
  options: any[] = [];
  valueType: SelectValueType;
  clearable = true;
  filterable = true;
  hide = false;
  allowCreate = false;

  constructor(
    key: string,
    value: any[] = [],
    valueType: SelectValueType = SelectValueType.Array,
  ) {
    this.key = key;
    this.value = value;
    this.valueType = valueType;
  }

  setClearable(b: boolean) {
    this.clearable = b;
  }

  setFilterable(b: boolean) {
    this.filterable = b;
  }

  setHide(b: boolean) {
    this.hide = b;
  }

  setOptions(options: Option[]) {
    this.options = options;
  }

  setAllowCreate(b: boolean) {
    this.allowCreate = b;
  }

  get ValueLabel(): any[] {
    console.log(this.options, this.value);
    // eslint-disable-next-line eqeqeq
    const res: any[] = [];
    this.options.forEach((item) => {
      if (this.value.includes(item.value)) {
        res.push(item.label);
      }
    });
    return res;
  }

  initValue() {
    this.value = [];
  }
}

export class DateValue implements IDateValue {
  key: string;
  value: string;
  valueType: DateValueType;
  clearable = true;

  constructor(
    key: string,
    value = '',
    valueType: DateValueType = DateValueType.String,
  ) {
    this.key = key;
    this.value = value;
    this.valueType = valueType;
  }

  initValue() {
    this.value = '';
  }
}

export class DateRangeValue implements IDateRangeValue {
  key: string;
  keys: [string, string];
  value: any[];
  valueType: DateValueType;
  // 是否自动添加时间后缀(startDateTime会自动追加00:00:00 endDateTime会自动追加23:59:59, 如果是时间戳类型的也会自动转换)
  addTimeSuffix: boolean;
  clearable = true;
  hide = false;

  constructor(
    key: string,
    keys: [string, string],
    value: any[] = [],
    valueType: DateValueType = DateValueType.String,
    addTimeSuffix = false,
  ) {
    this.key = key;
    this.keys = keys;
    this.value = value;
    this.valueType = valueType;
    this.addTimeSuffix = addTimeSuffix;
  }

  setClearable(b: boolean) {
    this.clearable = b;
  }

  setHide(b: boolean) {
    this.hide = b;
  }

  initValue() {
    this.value = [];
  }
}

export class DateTimeRangeValue implements IDateTimeRangeValue {
  key: string;
  keys: [string, string];
  value: any[];
  valueType: DateValueType;

  constructor(
    key: string,
    keys: [string, string],
    value: any[] = [],
    valueType: DateValueType = DateValueType.String,
  ) {
    this.key = key;
    this.keys = keys;
    this.value = value;
    this.valueType = valueType;
  }

  initValue() {
    this.value = [];
  }
}

export class SearchItemBuild {
  private label = '';
  private placeholder?: string | undefined;
  private default?: boolean | undefined;
  private permission?: string | undefined;
  private value: ISearchValue | undefined = undefined;

  setLabel(label: string): SearchItemBuild {
    this.label = label;
    return this;
  }

  setPlaceholder(placeholder: string): SearchItemBuild {
    this.placeholder = placeholder;
    return this;
  }

  setDefault(def: boolean): SearchItemBuild {
    this.default = def;
    return this;
  }

  setPermission(permission: string): SearchItemBuild {
    this.permission = permission;
    return this;
  }

  setValue(value: ISearchValue): SearchItemBuild {
    this.value = value;
    return this;
  }

  setApi(
    /** 接口地址 */
    api: (pramas: Record<string, any>) => Promise<Option[]>,
    /** 请求参数 */
    params: Record<string, any> = {},
  ): SearchItemBuild {
    api?.(params).then((_res) => {
      if (
        this.value instanceof SelectValue ||
        this.value instanceof MultiSelectValue
      ) {
        this.value.setOptions(_res);
      }
    });
    return this;
  }

  get Label() {
    return this.label;
  }

  get Placeholder() {
    return this.placeholder;
  }

  get Default() {
    return this.default;
  }

  get Permission() {
    return this.permission;
  }

  get Value() {
    return this.value;
  }

  build(): SearchItem {
    return new SearchItem(this);
  }
}

export class SearchItem {
  private label = '';
  private placeholder?: string | undefined;
  private default?: boolean | undefined;
  private permission?: string | undefined;
  private value: ISearchValue | undefined = undefined;

  constructor(builder: SearchItemBuild) {
    this.label = builder.Label;
    this.placeholder = builder.Placeholder;
    this.default = builder.Default;
    this.permission = builder.Permission;
    this.value = builder.Value;
  }

  get Label() {
    return this.label;
  }

  get Placeholder() {
    return this.placeholder;
  }

  get Default() {
    return this.default;
  }

  get Permission() {
    return this.permission;
  }

  get Value() {
    return this.value;
  }
}

export class SearchParamBuild {
  private searchItems: SearchItem[] = [];
  private showMoreFilterBtn = true;

  setShowMoreFilterBtn(showMoreFilterBtn: boolean): SearchParamBuild {
    this.showMoreFilterBtn = showMoreFilterBtn;
    return this;
  }

  get ShowMoreFilterBtn() {
    return this.showMoreFilterBtn;
  }

  get SearchItems() {
    return this.searchItems;
  }

  add(searchItem: SearchItem): SearchParamBuild {
    this.searchItems.push(searchItem);
    return this;
  }

  build(): SearchParam {
    return new SearchParam(this);
  }
}

export class SearchParam {
  private searchItems: SearchItem[] = [];
  private showMoreFilterBtn = true;

  constructor(builder: SearchParamBuild) {
    this.searchItems = builder.SearchItems;
    this.showMoreFilterBtn = builder.ShowMoreFilterBtn;
  }

  get SearchItems(): SearchItem[] {
    return this.searchItems;
  }

  get ShowMoreFilterBtn() {
    return this.showMoreFilterBtn;
  }

  getSearchItem(key: string): SearchItem | undefined {
    return this.searchItems.find((item: SearchItem) => item.Value?.key === key);
  }

  get Params(): any {
    const params: any = {};
    this.searchItems
      .filter(
        (item: SearchItem) =>
          isEmpty(item.Permission) ||
          (item.Permission && hasPermission(item.Permission)),
      )
      .forEach((item: SearchItem) => {
        if (item.Value instanceof InputValue) {
          params[item.Value.key] = encodeURIComponent(item.Value.value);
        } else if (item.Value instanceof SelectValue) {
          params[item.Value.key] = item.Value.value;
        } else if (item.Value instanceof MultiSelectValue) {
          params[item.Value.key] =
            item.Value.valueType === SelectValueType.Array
              ? item.Value.value
              : item.Value.value.join(',');
        } else if (item.Value instanceof DateValue) {
          params[item.Value.key] =
            item.Value.valueType === DateValueType.String
              ? item.Value.value
              : timestamp(item.Value.value);
        } else if (item.Value instanceof DateRangeValue) {
          if (item.Value.value && item.Value.value.length === 2) {
            params[item.Value.keys[0]] =
              item.Value.valueType === DateValueType.String
                ? encodeURIComponent(
                    item.Value.value[0] +
                      (item.Value.addTimeSuffix ? ' 00:00:00' : ''),
                  )
                : timestamp(
                    item.Value.value[0] +
                      (item.Value.addTimeSuffix ? ' 00:00:00' : ''),
                  );
            params[item.Value.keys[1]] =
              item.Value.valueType === DateValueType.String
                ? encodeURIComponent(
                    item.Value.value[1] +
                      (item.Value.addTimeSuffix ? ' 23:59:59' : ''),
                  )
                : timestamp(
                    item.Value.value[1] +
                      (item.Value.addTimeSuffix ? ' 23:59:59' : ''),
                  );
          } else {
            params[item.Value.keys[0]] = '';
            params[item.Value.keys[1]] = '';
          }
        } else if (item.Value instanceof DateTimeRangeValue) {
          if (item.Value.value && item.Value.value.length === 2) {
            params[item.Value.keys[0]] =
              item.Value.valueType === DateValueType.String
                ? encodeURIComponent(item.Value.value[0])
                : timestamp(item.Value.value[0]);
            params[item.Value.keys[1]] =
              item.Value.valueType === DateValueType.String
                ? encodeURIComponent(item.Value.value[1])
                : timestamp(item.Value.value[1]);
          } else {
            params[item.Value.keys[0]] = '';
            params[item.Value.keys[1]] = '';
          }
        } else if (item.Value instanceof NumericalIntervalValue) {
          params[item.Value.keys[0]] = item.Value.value[0];
          params[item.Value.keys[1]] = item.Value.value[1];
        }
      });
    return params;
  }

  setSelectOptions(key: string, options: Option[]) {
    if (!this.getSearchItem(key)) {
      throw new Error(`The "${key}" search parameter was not found`);
    }
    if (
      this.getSearchItem(key)?.Value instanceof SelectValue ||
      this.getSearchItem(key)?.Value instanceof MultiSelectValue
    ) {
      if (this.getSearchItem(key)?.Value instanceof SelectValue) {
        (this.getSearchItem(key)?.Value as SelectValue).setOptions(options);
      } else {
        (this.getSearchItem(key)?.Value as MultiSelectValue).setOptions(
          options,
        );
      }
    } else {
      throw new Error(
        `The ValueType of "${key}" search parameter is not SelectValue || MultiSelectValue`,
      );
    }
  }

  print(): void {
    console.log('SearchParam', this.Params);
  }
}
