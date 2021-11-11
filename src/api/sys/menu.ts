import { defHttp } from '/@/utils/http/axios';
import qs from 'qs';

enum Api {
  Save = '/sys/menu/save',
  SaveAuthButton = '/sys/menu/saveAuthButton',
  Delete = '/sys/menu/delete',
  Update = '/sys/menu/update',
  Get = '/sys/menu/get',
  getUserMenuTree = '/sys/menu/getUserMenuTree',
}

/**
 * 添加
 */
export const saveMenu = (menu) => {
  return defHttp.post({ url: Api.Save, params: menu }, { isTransformResponse: true });
};
/**
 * 添加
 */
export const saveAuthButton = (authButtonForm: {
  modelName?: string;
  authPrefix: string;
  pid: string;
}) => {
  const params = qs.stringify(authButtonForm);
  return defHttp.post({ url: Api.SaveAuthButton + '?' + params }, { isTransformResponse: true });
};
/**
 * 删除
 */
export const deleteMenu = (id) => {
  return defHttp.delete(
    { url: Api.Delete + '/' + id + '?includeSelf=true' },
    { isTransformResponse: true }
  );
};
/**
 * 删除子菜单
 */
export const deleteMenuChildren = (id) => {
  return defHttp.delete(
    { url: Api.Delete + '/' + id + '?includeSelf=false' },
    { isTransformResponse: true }
  );
};
/**
 * 修改
 */
export const updateMenu = (menu) => {
  return defHttp.put({ url: Api.Update, params: menu }, { isTransformResponse: true });
};
/**
 * 获取单条菜单
 */
export const getMenu = async (id: string) => {
  const response = await defHttp.get({ url: Api.Get + '/' + id });
  return response.data?.data;
};
/**
 * 获取用户菜单树
 */
export const getUserMenuTree = async () => {
  const response = await defHttp.get({ url: Api.getUserMenuTree });
  return response.data?.data;
};
/**
 * 获取用户菜单树
 */
export const getUserMenuTreeAsPromise = () => {
  return defHttp.get({ url: Api.getUserMenuTree });
};
