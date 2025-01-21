interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

interface BasicUserInfo {
  /**
   * 用户id
   */
  id: string;
  createdBy: string;
  /**
   * 创建时间
   */
  createdTime: string;
  /**
   * 描述
   */
  description: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 父级id
   */
  parentId: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 手机号
   */
  phoneNumber: string;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户角色
   */
  roles?: string[];
  /**
   * 用户角色id
   */
  roleIds?: number[];
  /**
   * 用户名
   */
  username: string;
  /**
   * 权限标识码
   */
  permissions: string[];
  /**
   * 状态
   */
  status: 0 | 1;
  /**
   * 首页地址
   */
  homePath: string;

  /**
   * accessToken
   */
  token?: string;
}

type ClassType = Array<object | string> | object | string;

export type { BasicOption, BasicUserInfo, ClassType, SelectOption, TabOption };
