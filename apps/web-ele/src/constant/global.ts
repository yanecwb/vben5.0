export const pickerQuickOptions = {
  shortcuts: [
    {
      text: '今天',
      onClick(picker: any) {
        picker.$emit('pick', [new Date(), new Date()])
      }
    },
    {
      text: '昨天',
      onClick(picker: any) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', [date, date])
      }
    },
    {
      text: '近7天',
      onClick(picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '近14天',
      onClick(picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 13)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '近30天',
      onClick(picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '近3个月',
      onClick(picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 89)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '本周',
      onClick(picker: any) {
        const end = new Date()
        const start = new Date()
        //现在星期几；0代表星期天，6代表星期六
        const thisDay = start.getDay()
        //现在是一个月的第几天
        const thisDate = start.getDate()
        if (thisDay != 0) {
          start.setDate(thisDate - thisDay + 1)
        }
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '上周',
      onClick(picker: any) {
        // 上周开始时间
        const starta = new Date()
        const first = starta.getDate() - starta.getDay() - 6
        const startDate = new Date(starta.setDate(first))
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        //  上周结束时间
        const currentDate = new Date()
        const firsts = currentDate.getDate() - currentDate.getDay() - 6
        const last = firsts + 6
        const endDate = new Date(currentDate.setDate(last))
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 0)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '本月',
      onClick(picker: any) {
        const end = new Date()
        const start = new Date()
        start.setDate(1)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '上月',
      onClick(picker: any) {
        const oDate = new Date()
        let year = oDate.getFullYear()
        const month = oDate.getMonth()
        let start, end
        if (month == 0) {
          year--
          start = new Date(year, 11, 1)
          end = new Date(year, 11, 31)
        } else {
          start = new Date(year, month - 1, 1)
          end = new Date(year, month, 0)
        }
        picker.$emit('pick', [start, end])
      }
    }
  ]
}

export enum TAG_DEFAULT {
  Primary = 'badge badge-soft-primary',
  Success = 'badge badge-soft-success',
  Info = 'badge badge-soft-info',
  Danger = 'badge badge-soft-danger',
  Warning = 'badge badge-soft-warning',
  Dark = 'badge badge-soft-dark',
  Light = 'badge badge-soft-light'
}
