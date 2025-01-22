import { requestClient } from '#/api/request';
export const taskRevenueReportApi = (params: any) =>
  requestClient.get('/report/taskReport/query', { params });
