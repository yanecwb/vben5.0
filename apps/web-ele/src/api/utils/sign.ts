import md5 from 'js-md5'
const Md5: any = md5;

export default class SignUtil {
  static sign(data: any, timestamp: any, salt: any): string {
    // console.debug('data:', data)
    // // 1.处理url格式, 去除网关中定义的服务名称那一节
    // // const urlParam = url.substring(url.indexOf('/', 1))

    // let bodyParam = ''
    // if (method === 'post') {
    //   // 3.处理body格式
    //   bodyParam = data
    // } else if (method === 'get') {
    //   // 2.处理params格式
    //   bodyParam = SignUtil.objectToQueryString(data)
    // }
    // const sign = Array.of(bodyParam)
    //   .filter((item) => item)
    //   .join('&')
    // console.debug('sign raw', sign)
    const datas = data === '{}' ? '' : data
    return Md5(datas + timestamp + salt)
  }

  /**
   * 将object转换成key=value格式, 字段排序: key按升序处理
   *
   * @param object
   * @param separator 多个值之间分隔的分隔符
   * @returns e.g  a=1#b=2#c=3
   */
  static objectToQueryString(object: any, separator = '&') {
    let queryString = ''
    Object.keys(object || {})
      .sort()
      // sign字段不参与签名, 字段值为undefined的不参与签名
      .filter((key) => key !== 'sign' && object[key] !== undefined)
      // 字段值是对象的不参与签名
      .filter((key) => Object.prototype.toString.call(object[key]) !== '[object Object]')
      // 值类型为数组的且长度为0的不参与签名
      .filter((key) => !Array.isArray(object[key]) || (Array.isArray(object[key]) && object[key].length > 0))
      .forEach((key) => {
        let paramValue
        if (Array.isArray(object[key])) {
          paramValue = object[key].sort().join(',')
        } else {
          paramValue = object[key] !== null ? object[key] : ''
        }
        if (queryString) {
          queryString += separator
        }
        queryString = `${queryString}${key}=${paramValue}`
      })
    return queryString
  }
}
