export enum SearchType {
  Select,
  MultiSelect,
  Input,
  Date,
  DateRange,
  DateTimeRange,
  // 区间
  Interval
}

export enum SelectValueType {
  Array,
  CommaSeparated
}

export enum DateValueType {
  String,
  Timestamp
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISearchValue {
  readonly key: string
  initValue: Function
  hide?: boolean
}

export interface IInputValue extends ISearchValue {
  readonly key: string
  value: string
}

export interface INumericalIntervalValue extends ISearchValue {
  readonly keys: [string, string]
  value: string[]
}

export interface ISelectValue {
  readonly key: string
  value: string
  options: any[]
  clearable: boolean
  filterable: boolean
}

export interface IMultiSelectValue {
  readonly key: string
  value: any[]
  readonly valueType: SelectValueType
  options: any[]
  clearable: boolean
  filterable: boolean
}

export interface IDateValue {
  readonly key: string
  value: string
  clearable: boolean
}

export interface IDateRangeValue {
  readonly keys: [string, string]
  value: any[]
  readonly valueType: DateValueType
  readonly addTimeSuffix: boolean
}

export interface IDateTimeRangeValue {
  readonly keys: [string, string]
  value: any[]
  readonly valueType: DateValueType
}
