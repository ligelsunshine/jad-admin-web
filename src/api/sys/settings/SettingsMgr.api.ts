import { defHttp } from '/@/utils/http/axios';
import { Settings } from '/@/views/sys/settings-mgr/Settings.data';

enum Api {
  Save = '/sys/settingsMgr/save',
  Delete = '/sys/settingsMgr/delete',
  Update = '/sys/settingsMgr/update',
  Get = '/sys/settingsMgr/get',
  GetTree = '/sys/settingsMgr/getTree',
}

/**
 * 添加系统设置管理
 */
export const saveApi = (settings: Settings) => {
  return defHttp.post({ url: Api.Save, params: settings }, { isTransformResponse: true });
};

/**
 * 删除系统设置管理
 */
export const deleteApi = (id: string) => {
  return defHttp.delete(
    { url: Api.Delete + '/' + id + '?includeSelf=true' },
    { isTransformResponse: true }
  );
};

/**
 * 删除子系统设置管理
 */
export const deleteChildrenApi = (id: string) => {
  return defHttp.delete(
    { url: Api.Delete + '/' + id + '?includeSelf=false' },
    { isTransformResponse: true }
  );
};

/**
 * 修改系统设置管理
 */
export const updateApi = (settings: Settings) => {
  return defHttp.put({ url: Api.Update, params: settings }, { isTransformResponse: true });
};

/**
 * 获取单条系统设置管理
 */
export const getApi = async (id: string) => {
  const response = await defHttp.get({ url: Api.Get + '/' + id });
  return response.data?.data;
};

/**
 * 获取系统设置管理树
 */
export const getTreeApi = async () => {
  const response = await defHttp.get({ url: Api.GetTree });
  return response.data?.data;
};
/**
 * 获取系统设置管理树
 */
export const getTreeAsPromiseApi = async () => {
  return defHttp.get({ url: Api.GetTree });
};
