import md5 from 'js-md5';
const Md5: any = md5;

export default class signMd5Utils {
  /**
   * json参数升序
   * @param jsonObj 发送参数
   */

  static sort(jsonObj: any) {
    const newkey = Object.keys(jsonObj).sort();
    const newObj: any = {}; //创建一个新的对象，用于存放排好序的键值对
    for (let i = 0; i < newkey.length; i++) {
      //遍历newkey数组
      newObj[newkey[i] as any] = jsonObj[newkey[i] as any]; //向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj;
  }

  static sortAsc(jsonObj: any) {
    const arr = [];
    let num = 0;
    for (const i in jsonObj) {
      arr[num] = i;
      num++;
    }
    const sortArr = arr.sort();
    const sortObj: any = {};
    for (const i in sortArr) {
      const sortArrI = sortArr[i] as any;
      sortObj[sortArrI] = jsonObj[sortArrI];
      if (sortObj[sortArrI] instanceof Array) {
        sortObj[sortArrI] = sortObj[sortArrI].map((item: any) => {
          if (item instanceof Object) {
            return (item = this.sort(item));
          } else {
            return item;
          }
        });
      }
    }
    return sortObj;
  }

  /**
   * @param url 请求的url,应该包含请求参数(url的?后面的参数)
   * @param requestParams 请求参数(POST的JSON参数)
   * @returns {string} 获取签名
   */
  static getSign(url: any, requestParams: any, method: any) {
    const urlParams = this.parseQueryString(url);
    const jsonObj = this.mergeObject(urlParams, requestParams, method);
    const requestBody = this.sortAsc(jsonObj);
    return Md5(JSON.stringify(requestBody)).toUpperCase();
  }

  /**
   * @param url 请求的url
   * @returns {{}} 将url中请求参数组装成json对象(url的?后面的参数)
   */
  static parseQueryString(url: any) {
    // eslint-disable-next-line no-useless-escape
    const urlReg = /^[^\?]+\?([\w\W]+)$/,
      paramReg = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
      urlArray = urlReg.exec(url),
      result: any = {};
    if (urlArray && urlArray[1]) {
      // eslint-disable-next-line prefer-const
      let paramString = urlArray[1],
        paramResult;
      while ((paramResult = paramReg.exec(paramString)) != null) {
        result[paramResult[1] as any] = paramResult[2];
      }
    }
    return result;
  }

  /**
   * @returns {*} 将两个对象合并成一个
   */
  static mergeObject(objectOne: any, objectTwo: any, method: any) {
    if (Object.keys(objectTwo).length > 0) {
      for (const key in objectTwo) {
        if (Array.isArray(objectTwo)) {
          objectTwo = { rawList: objectTwo };
        }
        // 判断类型 number 和 boolen 的类型 需要转为 string
        if (['number', 'boolean'].includes(typeof objectTwo[key])) {
          objectTwo[key] = String(objectTwo[key]);
        }
        // 判断是否为空对象 如果是空对象就删除
        if (Object.keys(objectTwo[key]).length === 0) {
          delete objectTwo[key];
        }
        // post 请求中带有 value 为 null 的 key 需要清除
        if (method === 'post' || method === 'put' || method === 'delete') {
          if (objectTwo[key] === null) {
            delete objectTwo[key];
          }
          if (objectTwo.rawList) {
            if (Array.isArray(objectTwo.rawList)) {
              // objectTwo.rawList.forEach((k: any, i: any) => {
              //   for(const k2 in objectTwo.rawList) {
              //     console.log('objectTwo.rawList[k2]', objectTwo.rawList[k2])
              //     if (['number', 'boolean'].includes(typeof objectTwo.rawList[k2])) {
              //       objectTwo.rawList[k2] = String(objectTwo.rawList[k2])
              //     }
              //     if (objectTwo.rawList[k2] === null) {
              //       delete objectTwo.rawList[k2]
              //     }
              //   }
              // })
            }
          }
        }
        // get 请求 空数组需要 清除
        if (method === 'get') {
          console.log('objectTwo[key]', objectTwo[key]);
          if (Array.isArray(objectTwo[key]) && objectTwo[key].length === 0) {
            delete objectTwo[key];
          }
          if (objectTwo[key] === null) {
            delete objectTwo[key];
          }
        }
        // eslint-disable-next-line no-prototype-builtins
        if (objectTwo.hasOwnProperty(key) === true) {
          objectOne[key] = objectTwo[key];
        }
        if (objectTwo.rawList) {
          objectOne = objectTwo;
        }
      }
    }
    return objectOne;
  }

  static urlEncode(param: any, key: any, encode: any) {
    if (param == null) return '';
    let paramStr = '';
    const t = typeof param;
    if (t === 'string' || t === 'number' || t === 'boolean') {
      paramStr +=
        '&' +
        key +
        '=' +
        (encode == null || encode ? encodeURIComponent(param) : param);
    } else {
      for (const i in param) {
        const k =
          key == null
            ? i
            : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
        paramStr += this.urlEncode(param[i], k, encode);
      }
    }
    return paramStr;
  }
}
