import { SearchForm } from '/@/components/Table';
import { defHttp } from '/@/utils/http/axios';
import { DictData } from '/@/views/sys/dict/data/DictData.data';

enum Api {
  Save = '/sys/dictData/save',
  Delete = '/sys/dictData/delete',
  Update = '/sys/dictData/update',
  GetPage = '/sys/dictData/get/page',
}

/**
 * 添加字典数据
 */
export const saveApi = (dictData: DictData) => {
  return defHttp.post({ url: Api.Save, params: dictData }, { isTransformResponse: true });
};

/**
 * 删除字典数据
 */
export const deleteApi = (id: string) => {
  return defHttp.delete({ url: Api.Delete + '/' + id }, { isTransformResponse: true });
};

/**
 * 修改字典数据
 */
export const updateApi = (dictData: DictData) => {
  return defHttp.put({ url: Api.Update, params: dictData }, { isTransformResponse: true });
};

/**
 * 分页获取字典数据
 */
export const getPageApi = async (params?: SearchForm) => {
  const response = await defHttp.post({ url: Api.GetPage, params: params });
  return response.data?.data;
};
