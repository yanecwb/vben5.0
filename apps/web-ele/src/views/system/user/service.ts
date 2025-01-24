import { requestClient } from '#/api/request';

export const queryUsers = (params: any) => {
  return requestClient.get('/admin/user/users', { params });
};

export const deleteUser = (data: any) => {
  return requestClient.delete(`/admin/user`, data);
};

export const getUserById = (params: any) => {
  return requestClient.get(`/admin/user`, { params });
};

export const createUser = (data: any) => {
  return requestClient.post('/admin/user', data);
};

export const updateUser = (data: any) => {
  return requestClient.put(`/admin/user`, data);
};
