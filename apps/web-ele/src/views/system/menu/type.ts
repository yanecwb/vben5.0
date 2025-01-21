export enum MenuCagegory {
  UserPlatform = 1,
  MgmtPlatform = 2
}
export enum MenuType {
  // 1:菜单 2:按钮 3:不可点击菜单 4:不可点击按钮 5:第三方app 6:数据权限
  Menu = 1,
  Button = 2,
  DisableMenu = 3,
  DisableAction = 4,
  App = 5,
  DataPermission = 6
}
export interface Menu {
  id: number
  parentId: number
  type: number
  name: string
  href: string
  component: string
  icon: string
  keepalive: number
  resource: string
  orderNum: number
  description: string
  children: Menu[]
}

export interface Permission {
  id: number
  typeName: string
  name: string
  resource: string
  category: MenuCagegory
}

// export const enum PermissionType {

// }
