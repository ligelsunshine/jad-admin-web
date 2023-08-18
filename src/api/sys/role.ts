import { defHttp } from '/@/utils/http/axios';
import qs from 'qs';

enum Api {
  Save = '/sys/role/save',
  Delete = '/sys/role/delete',
  Update = '/sys/role/update',
  UpdateDefaultRole = '/sys/role/update/defaultRole',
  UpdateStatus = '/sys/role/update/status',
  GetDefaultRole = '/sys/role/get/defaultRole',
  GetRoleList = '/sys/role/get/list',
  GetRoleListPage = '/sys/role/get/page',
  GetRoleMenuItems = '/sys/role/getRoleMenuItems',
  AssignPermissions = '/sys/role/assignPermissions',
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
export const updateRoleStatus = async (id, status) => {
  status = status == 0 ? 'ENABLE' : 'DISABLE';
  const params = qs.stringify({ id, status });
  return defHttp.put({ url: Api.UpdateStatus + '?' + params }, { isTransformResponse: true });
};
/**
 * 获取默认角色
 */
export const getDefaultRole = async () => {
  const response = await defHttp.get({ url: Api.GetDefaultRole });
  return response.data?.data;
};
/**
 * 修改默认角色
 */
export const updateDefaultRole = async (id) => {
  const params = qs.stringify({ id });
  return defHttp.put({ url: Api.UpdateDefaultRole + '?' + params }, { isTransformResponse: true });
};
/**
 * 获取所有
 */
export const getRoleList = async () => {
  const response = await defHttp.get({ url: Api.GetRoleList });
  return response.data?.data;
};
/**
 * 分页获取
 */
export const getRoleListPage = async (params) => {
  const response = await defHttp.post({ url: Api.GetRoleListPage, params: params });
  return response.data?.data;
};
/**
 * 获取角色菜单列表
 */
export const getRoleMenuItems = async (roleId) => {
  const response = await defHttp.get({ url: `${Api.GetRoleMenuItems}?roleId=${roleId}` });
  return response.data?.data;
};

/**
 * 分配权限
 */
export const AssignPermissions = async (params) => {
  return defHttp.put({ url: Api.AssignPermissions, params: params });
};
