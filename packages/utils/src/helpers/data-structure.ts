// 对象去除空元素
export function dataEmpty(event: any) {
  Object.keys(event).map((item) => {
    if (!event[item] && event[item] !== 0) {
      delete event[item]
    }
  })
  return event
}
