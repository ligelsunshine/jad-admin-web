import { defHttp } from '/@/utils/http/axios';
import qs from "qs";

enum Api {
  Save = '/sys/role/save',
  Delete = '/sys/role/delete',
  Update = '/sys/role/update',
  UpdateStatus = '/sys/role/update/status',
  ListPage = '/sys/role/get/page',
}

/**
 * 添加
 */
export const saveRole = (role) => {
  return defHttp.post({ url: Api.Save, params: role });
};
/**
 * 删除
 */
export const deleteRole = (id) => {
  return defHttp.delete({ url: Api.Delete + '/' + id });
};
/**
 * 修改
 */
export const updateRole = (role) => {
  return defHttp.put({ url: Api.Update, params: role });
};
/**
 * 修改状态
 */
export const updateRoleStatus = (id, status) => {
  status = status == 0 ? 'ENABLE' : 'DISABLE';
  const params = qs.stringify({ id, status });
  return defHttp.put({ url: Api.UpdateStatus + '?' + params });
};
/**
 * 分页获取
 */
export const getRoleListPage = async (params) => {
  const response = await defHttp.post({ url: Api.ListPage, params: params });
  return response.data?.data;
};
