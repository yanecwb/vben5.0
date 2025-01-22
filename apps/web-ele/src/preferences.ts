import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */

export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    accessMode: 'backend',
    name: import.meta.env.VITE_APP_TITLE,
    /* 开启Token刷新机制 */
    enableRefreshToken: false,
    loginExpiredMode: 'page',
    watermark: true,
  },
  theme: {
    mode: 'light',
  },
  copyright: {
    companyName: 'Mobikok',
    date: '2025',
  },
  sidebar: {
    width: 220,
  },
  footer: {
    enable: true,
    fixed: true,
  },
  navigation: {
    accordion: false,
  },
  widget: {
    notification: false,
  },
});
