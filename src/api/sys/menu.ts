import { defHttp } from '/@/utils/http/axios';

enum Api {
  Save = '/sys/menu/save',
  Delete = '/sys/menu/delete',
  Update = '/sys/menu/update',
  Get = '/sys/menu/get',
  GetMenuList = '/sys/menu/getMenuList',
  GetMenuTree = '/sys/menu/getMenuTree',
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
  return defHttp.delete({ url: Api.Delete + '/' + id });
};
/**
 * 修改
 */
export const updateMenu = (menu) => {
  return defHttp.put({ url: Api.Update, params: menu });
};
/**
 * 获取用户菜单列表
 */
export const getMenuList = () => {
  return defHttp.get({ url: Api.GetMenuList });
};
/**
 * 获取用户菜单树
 */
export const getMenuTree = async () => {
  const response = await defHttp.get({ url: Api.GetMenuTree });
  return response.data?.data;
};
