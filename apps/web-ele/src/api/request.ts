/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { HttpResponse } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { ElMessage } from 'element-plus';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';

//
import SignUtil from './utils/sign';
import signMd5Utils from './utils/signMd5Utils';
import { smCrypto } from './utils/smcrypto';
import { dataEmpty } from '@vben/utils';
import { sleep } from '#/utils/global';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string) {
  const client = new RequestClient({
    baseURL,
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const authStore = useAuthStore();
    await authStore.logout(true);

    // const accessStore = useAccessStore();
    // if (
    //   preferences.app.loginExpiredMode === 'modal' &&
    //   accessStore.isAccessChecked
    // ) {
    //   accessStore.setLoginExpired(true);
    // } else {
    //   await authStore.logout();
    // }
    // console.log(accessStore);
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `bearer ${token}` : null;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const timestamp = new Date().getTime();
      const accessStore = useAccessStore();
      const clientPlatformToken =
        config.url?.includes('/auth/oauth/token') &&
        'Basic aGl2ZWFkc190Z19tZ210X3BsYXRmb3JtOmhpdmVhZHNfdGcjMjA0OA==';

      config.headers.timestamp = timestamp;
      config.headers.Authorization =
        clientPlatformToken || formatToken(accessStore.accessToken); //+'1';
      config.headers['Accept-Language'] = preferences.app.locale;

      /* Sign */
      const salt = '61ee84d1199a4c719d6135a0a63104e3';
      const paramsStr = config.params
        ? SignUtil.objectToQueryString(
            signMd5Utils.sortAsc(dataEmpty(config.params)),
          )
        : '';
      const signParam = SignUtil.sign(
        paramsStr || JSON.stringify(signMd5Utils.sortAsc(config.data)),
        timestamp,
        salt,
      );
      config.headers.sign = signParam;

      if (config.params) {
        console.log('request params', config.params);
        function processParams(
          params: Record<string, any> | undefined,
        ): Record<string, any> {
          if (!params || Object.keys(params).length === 0) {
            return {};
          }
          const sortedParams = signMd5Utils.sortAsc(params);
          const queryString = SignUtil.objectToQueryString(sortedParams);
          return queryString ? { param: smCrypto(queryString) } : {};
        }
        config.params = processParams(dataEmpty(config.params));
      }

      if (config.data) {
        console.log('request data', signMd5Utils.sortAsc(config.data));
        function processData(
          data: Record<string, any> | undefined,
        ): string | undefined {
          if (!data || Object.keys(data).length === 0) {
            return undefined;
          }
          const sortedData = signMd5Utils.sortAsc(data);
          return smCrypto(JSON.stringify(sortedData));
        }
        config.data = processData(config.data);
      }

      return config;
    },
  });

  // response数据解构
  client.addResponseInterceptor<HttpResponse>({
    fulfilled: (response) => {
      const { data: responseData, status } = response;

      const { code, data } = responseData;
      if (response.config.url?.includes('/auth/oauth/token')) {
        return responseData;
      }
      if (status >= 200 && status < 400 && code === 200) {
        return data;
      }

      throw Object.assign({}, response, { response });
    },
  });

  // token过期的处理 .. 暂时不用，token过期会返回401，跳转登陆
  // client.addResponseInterceptor(
  //   authenticateResponseInterceptor({
  //     client,
  //     doReAuthenticate,
  //     doRefreshToken,
  //     enableRefreshToken: preferences.app.enableRefreshToken,
  //     formatToken,
  //   }),
  // );

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor(async (msg: string, error) => {
      // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
      // 当前mock接口返回的错误字段是 error 或者 message
      const responseData = error?.response?.data ?? {};
      const errorMessage = responseData?.error ?? responseData?.message ?? '';
      // 如果没有错误信息，则会根据状态码进行提示

      if (error.status === 401) {
        ElMessage.error('用户信息已过期，请重新登陆');
        await sleep(1000);
        doReAuthenticate();
        return;
      }
      ElMessage.error(errorMessage || msg);
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL);

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
