import { SearchForm } from '/@/components/Table';
import { defHttp } from '/@/utils/http/axios';
import { FileStore } from '/@/views/file-store/oos/FileStore.data';

enum Api {
  Save = '/sys/fileStore/save',
  Delete = '/sys/fileStore/delete',
  DeleteArr = '/sys/fileStore/deleteArr',
  Update = '/sys/fileStore/update',
  Get = '/sys/fileStore/get',
  GetPage = '/sys/fileStore/get/page',
}

/**
 * 添加对象存储
 */
export const saveApi = (fileStore: FileStore) => {
  return defHttp.post({ url: Api.Save, params: fileStore }, { isTransformResponse: true });
};

/**
 * 删除对象存储
 */
export const deleteApi = (id: string) => {
  return defHttp.delete({ url: Api.Delete + '/' + id }, { isTransformResponse: true });
};

/**
 * 删除多个对象存储
 */
export const deleteArrApi = (ids: string[]) => {
  return defHttp.delete(
    { url: Api.DeleteArr, params: { ids: ids } },
    { isTransformResponse: true }
  );
};

/**
 * 修改对象存储
 */
export const updateApi = (fileStore: FileStore) => {
  return defHttp.put({ url: Api.Update, params: fileStore }, { isTransformResponse: true });
};

/**
 * 获取单条对象存储
 */
export const getApi = async (id: string) => {
  const response = await defHttp.get({ url: Api.Get + '/' + id });
  return response.data?.data;
};

/**
 * 分页获取对象存储
 */
export const getPageApi = async (params?: SearchForm) => {
  const response = await defHttp.post({ url: Api.GetPage, params: params });
  return response.data?.data;
};
