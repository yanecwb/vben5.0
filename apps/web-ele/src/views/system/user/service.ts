import { requestClient } from '#/api/request';

export const queryUsers = (params: any) => {
  return requestClient.get('/admin/user/users', { params });
};

export const deleteUser = (data: any) => {
  return requestClient.delete(`/admin/user`, { data });
};
