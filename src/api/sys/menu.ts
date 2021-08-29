import { defHttp } from '/@/utils/http/axios';

enum Api {
  Save = '/sys/menu/save',
  Delete = '/sys/menu/delete',
  Update = '/sys/menu/update',
  Get = '/sys/menu/get',
  getUserMenuTree = '/sys/menu/getUserMenuTree',
  GetRoleMenuList = '/sys/menu/getRoleMenuList',
}

/**
 * 添加
 */
export const saveMenu = (menu) => {
  return defHttp.post({ url: Api.Save, params: menu });
};
/**
 * 删除
 */
export const deleteMenu = (id) => {
  return defHttp.delete({ url: Api.Delete + '/' + id + '?includeSelf=true' });
};
/**
 * 删除子菜单
 */
export const deleteMenuChildren = (id) => {
  return defHttp.delete({ url: Api.Delete + '/' + id + '?includeSelf=false' });
};
/**
 * 修改
 */
export const updateMenu = (menu) => {
  return defHttp.put({ url: Api.Update, params: menu });
};
/**
 * 获取用户菜单树
 */
export const getUserMenuTree = async () => {
  const response = await defHttp.get({ url: Api.getUserMenuTree });
  return response.data?.data;
};
/**
 * 获取角色菜单列表
 */
export const getRoleMenuList = async (id) => {
  const response = await defHttp.get({ url: `${Api.GetRoleMenuList}?id=${id}` });
  return response.data?.data;
};
