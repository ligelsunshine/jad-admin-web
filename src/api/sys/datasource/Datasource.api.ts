import { SearchForm } from '/@/components/Table';
import { defHttp } from '/@/utils/http/axios';
import { Datasource } from '/@/views/sys/datasource/Datasource.data';

enum Api {
  Save = '/sys/datasource/save',
  Delete = '/sys/datasource/delete',
  DeleteArr = '/sys/datasource/deleteArr',
  Update = '/sys/datasource/update',
  Get = '/sys/datasource/get',
  GetPage = '/sys/datasource/get/page',
}

/**
 * 添加数据源
 */
export const saveApi = (datasource: Datasource) => {
  return defHttp.post({ url: Api.Save, params: datasource }, { isTransformResponse: true });
};

/**
 * 删除数据源
 */
export const deleteApi = (id: string) => {
  return defHttp.delete({ url: Api.Delete + '/' + id }, { isTransformResponse: true });
};

/**
 * 删除多个数据源
 */
export const deleteArrApi = (ids: string[]) => {
  return defHttp.delete(
    { url: Api.DeleteArr, params: { ids: ids } },
    { isTransformResponse: true }
  );
};

/**
 * 修改数据源
 */
export const updateApi = (datasource: Datasource) => {
  return defHttp.put({ url: Api.Update, params: datasource }, { isTransformResponse: true });
};

/**
 * 获取单条数据源
 */
export const getApi = async (id: string) => {
  const response = await defHttp.get({ url: Api.Get + '/' + id });
  return response.data?.data;
};

/**
 * 分页获取数据源
 */
export const getPageApi = async (params?: SearchForm) => {
  const response = await defHttp.post({ url: Api.GetPage, params: params });
  return response.data?.data;
};
