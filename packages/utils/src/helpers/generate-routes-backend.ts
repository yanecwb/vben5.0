import type { RouteRecordRaw } from 'vue-router';

import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  RouteRecordStringComponent,
  MenuRoute,
} from '@vben-core/typings';

import { mapTree } from '@vben-core/shared/utils';

/**
 * 动态生成路由 - 后端方式
 */
async function generateRoutesByBackend(
  options: GenerateMenuAndRoutesOptions,
): Promise<RouteRecordRaw[]> {
  const { fetchMenuListAsync, layoutMap = {}, pageMap = {} } = options;

  try {
    const menuRoutes = transformMenuRoutes(await fetchMenuListAsync?.());

    if (!menuRoutes) {
      return [];
    }

    const normalizePageMap: ComponentRecordType = {};

    for (const [key, value] of Object.entries(pageMap)) {
      normalizePageMap[normalizeViewPath(key)] = value;
    }

    const routes = convertRoutes(menuRoutes, layoutMap, normalizePageMap);
    return routes;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function convertRoutes(
  routes: RouteRecordStringComponent[],
  layoutMap: ComponentRecordType,
  pageMap: ComponentRecordType,
): RouteRecordRaw[] {
  return mapTree(routes, (node) => {
    const route = node as unknown as RouteRecordRaw;
    const { component, name, path } = node;

    if (!name) {
      console.error('route name is required', route);
    }

    // layout转换
    if (path === '/dashboard') {
      route.component = layoutMap[component]; //pageMap['/dashboard/analytics/index'];
      if (!route.children?.length) {
        const { children }: any = routes.find((i) => i.children?.length)!;
        route.redirect = children[0].path;
      }
    } else if (component && layoutMap[component]) {
      route.component = layoutMap[component];
      // 页面组件转换
    } else if (component) {
      const normalizePath = normalizeViewPath(component);
      route.component =
        pageMap[normalizePath] ?? pageMap['/_core/fallback/not-found'];
    }

    return route;
  });
}

function normalizeViewPath(path: string): string {
  // 去除相对路径前缀
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '');

  // 确保路径以 '/' 开头
  const viewPath = normalizedPath.startsWith('/')
    ? normalizedPath
    : `/${normalizedPath}`;

  // 这里耦合了vben-admin的目录结构
  return viewPath.replace(/^\/views/, '').split('.')[0] as string;
}

// 后续需要该数据结构
function transformMenuRoutes(
  menuRoutes?: MenuRoute[],
  isChildRoute = false,
  parentPath = '',
): RouteRecordStringComponent[] {
  if (!menuRoutes) return [];

  return menuRoutes.map((menuItem) => {
    const routePath = isChildRoute
      ? `/${parentPath}/${menuItem.href}`.replace(/\/+/g, '/')
      : `/${menuItem.href}`.replace(/\/+/g, '/');

    const routeConfig: RouteRecordStringComponent = {
      component: isChildRoute ? `${routePath}/index` : 'BasicLayout',
      meta: {
        title: menuItem.label,
        icon:
          menuItem.icon || (isChildRoute ? 'lucide:fan' : 'lucide:app-window'),
        order: menuItem.orderNum,
        affixTab: isChildRoute ? menuItem.affixTab : undefined,
        keepAlive: isChildRoute, 
      },
      name: isChildRoute ? menuItem.href : menuItem.name,
      path: routePath,
      redirect: menuItem.redirect,
      children: menuItem.children?.length
        ? transformMenuRoutes(menuItem.children, true, menuItem.href)
        : undefined,
    };

    return routeConfig;
  });
}

export { generateRoutesByBackend };
