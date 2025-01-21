import { requestClient } from '#/api/request';

export const createRole = (data: any) =>
  requestClient.post('/admin/role', data);

export const deleteRole = (params: any) =>
  requestClient.delete(`/admin/role`, { params });

export const updateRole = (data: any) => requestClient.put(`/admin/role`, data);

export const getRoleById = (params: any) =>
  requestClient.get(`/admin/role`, { params });

export const queryRoles = (params: any) =>
  requestClient.get('/admin/role/roles', { params });

// // 获取角色权限Ids
export const getRolePermissionIds = (params: any) =>
  requestClient.get(`/admin/role/menuIds`, { params });

// // 更新角色权限
export const updateRolePermission = (params: any) =>
  requestClient.put(
    `/admin/role/menuIds`,
    { params },
    // paramsSerializer: (params) => {
    //   return qs.stringify(params, { indices: false });
    // },
  );
