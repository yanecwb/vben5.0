import { v1 } from 'uuid';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useAccess } from '@vben/access';

export const hasPermission = (code: string): boolean | undefined => {
  const { hasAccessByCodes } = useAccess();
  return hasAccessByCodes(code);
};

export const sleep = (delay = 1500) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const getUuid = () => v1();

export const formatDate = (
  dateTime: string | number | Date,
  customFormat?: string,
): string => {
  if (dateTime) {
    return dayjs(dateTime).format(customFormat || 'YYYY-MM-DD');
  } else {
    return '-';
  }
};

export const formatHour = (dateTime: string | number | Date): string => {
  if (dateTime) {
    return dayjs(dateTime).format('YYYY-MM-DD HH');
  } else {
    return '-';
  }
};

export const formatDateTime = (dateTime: string | number | Date): string => {
  if (dateTime) {
    return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
  } else {
    return '-'
  }
}

export const timestamp = (dateTime: string | number | Date): number => {
  return dayjs(dateTime).valueOf();
};
export function getStartOrEnd(
  unit: 'date' | 'byDay' | 'byWeek' | 'byMonth' | 'byYear',
  value: string,
  type: 'start' | 'end',
) {
  if (!['start', 'end'].includes(type)) {
    throw new Error("Invalid type. Use 'start' or 'end'.");
  }
  dayjs.extend(isoWeek);

  switch (unit) {
    case 'byYear':
      return type === 'start'
        ? dayjs(`${value}-01-01 00:00:00`).format('YYYY-MM-DD HH:mm:ss')
        : dayjs(`${value}-12-31 23:59:59`).format('YYYY-MM-DD HH:mm:ss');
    case 'byMonth':
      return type === 'start'
        ? dayjs(`${value}-01 00:00:00`)
            .startOf('month')
            .format('YYYY-MM-DD HH:mm:ss')
        : dayjs(`${value}-01 00:00:00`)
            .endOf('month')
            .format('YYYY-MM-DD HH:mm:ss');
    case 'byWeek':
      if (type === 'start') {
        return dayjs(value)
          .isoWeekday(1)
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss');
      } else {
        return dayjs(value)
          .isoWeekday(7)
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss');
      }
    case 'byDay':
    case 'date':
      return type === 'start'
        ? dayjs(value).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : dayjs(value).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    default:
      throw new Error(
        "Invalid unit. Use 'year', 'month', 'week', 'day' or 'date'.",
      );
  }
}

// 多少天前
export function dayAgoDate(day: number, format = 'YYYY-MM-DD') {
  return dayjs().subtract(day, 'day').format(format)
}

export const debounce = function (excute: Function, delay: number) {
  let timer: any;
  return function (this: any, ...args: any) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      excute.apply(this, args);
    }, delay);
  };
};
