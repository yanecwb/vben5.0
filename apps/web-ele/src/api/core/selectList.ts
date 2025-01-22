import { requestClient } from '#/api/request';

export const getRoleOptions = () => requestClient.get('/admin/role/options');

export const getUserOptions = (params?: any) =>
  requestClient.get('/admin/user/options', { params });

export const getPublisherOptions = () =>
  requestClient.get('/mgmt/publisher/options');

export const getAppOptions = () => requestClient.get('/mgmt/app/options');

export const getAdUnitOptions = () => requestClient.get('/mgmt/adUnit/options');

export const getPartnerOptions = () =>
  requestClient.get('/mgmt/adPlatformPartner/options');

export const getPartnerAppOptions = () =>
  requestClient.get('/mgmt/adPlatformApp/options');

export const getExternalPartnerAppOptions = () =>
  requestClient.get('/mgmt/adPlatformApp/option');

export const getPartnerAdUnitOptions = () =>
  requestClient.get('/mgmt/adPlatformAdUnit/options');

export const getExternalPartnerAdUnitOptions = () =>
  requestClient.get('/mgmt/adPlatformAdUnit/option');
