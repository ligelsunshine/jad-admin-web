import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetMenuList = '/sys/menu/getMenuList',
  GetMenuTree = '/sys/menu/getMenuTree',
}

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
