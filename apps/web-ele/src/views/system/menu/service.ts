import { requestClient } from '#/api/request';

export const getMenuTree = () => requestClient.get<any>('/admin/menu/tree');

export const getMenuDetail = (params: any) =>
  requestClient.get('/admin/menu', { params });

export const addMenu = (data: any) => requestClient.post('/admin/menu', data);

export const updateMenu = (data: any) => requestClient.put('/admin/menu', data);

export const deleteMenuApi = (data: any) =>
  requestClient.delete('/admin/menu', data);
