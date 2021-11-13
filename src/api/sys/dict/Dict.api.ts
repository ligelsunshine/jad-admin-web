import { SearchForm } from '/@/components/Table';
import { defHttp } from '/@/utils/http/axios';
import { Dict } from '/@/views/sys/dict/Dict.data';

enum Api {
  Save = '/sys/dict/save',
  Delete = '/sys/dict/delete',
  DeleteArr = '/sys/dict/deleteArr',
  Update = '/sys/dict/update',
  Get = '/sys/dict/get',
  GetPage = '/sys/dict/get/page',
  GetDictData = '/sys/dict/getDictData',
}

/**
 * 添加字典
 */
export const saveApi = (dict: Dict) => {
  return defHttp.post({ url: Api.Save, params: dict }, { isTransformResponse: true });
};

/**
 * 删除字典
 */
export const deleteApi = (id: string) => {
  return defHttp.delete({ url: Api.Delete + '/' + id }, { isTransformResponse: true });
};

/**
 * 删除多个字典
 */
export const deleteArrApi = (ids: string[]) => {
  return defHttp.delete(
    { url: Api.DeleteArr, params: { ids: ids } },
    { isTransformResponse: true }
  );
};

/**
 * 修改字典
 */
export const updateApi = (dict: Dict) => {
  return defHttp.put({ url: Api.Update, params: dict }, { isTransformResponse: true });
};

/**
 * 获取单条字典
 */
export const getApi = async (id: string) => {
  const response = await defHttp.get({ url: Api.Get + '/' + id });
  return response.data?.data;
};

/**
 * 分页获取字典
 */
export const getPageApi = async (params?: SearchForm) => {
  const response = await defHttp.post({ url: Api.GetPage, params: params });
  return response.data?.data;
};

/**
 * 分页获取字典
 */
export const getDictData = async (code: string) => {
  const response = await defHttp.get({ url: Api.GetDictData + '/' + code });
  return response.data?.data;
};
