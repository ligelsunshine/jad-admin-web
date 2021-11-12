import { defHttp } from '/@/utils/http/axios';
import { DataClassify } from '/@/views/sys/data-classify/DataClassify.data';

enum Api {
  Save = '/sys/dataClassify/save',
  Delete = '/sys/dataClassify/delete',
  Update = '/sys/dataClassify/update',
  Get = '/sys/dataClassify/get',
  GetTree = '/sys/dataClassify/getTree',
}

/**
 * 添加数据分类
 */
export const saveApi = (dataClassify: DataClassify) => {
  return defHttp.post({ url: Api.Save, params: dataClassify }, { isTransformResponse: true });
};

/**
 * 删除数据分类
 */
export const deleteApi = (id: string) => {
  return defHttp.delete(
    { url: Api.Delete + '/' + id + '?includeSelf=true' },
    { isTransformResponse: true }
  );
};

/**
 * 删除子数据分类
 */
export const deleteChildrenApi = (id: string) => {
  return defHttp.delete(
    { url: Api.Delete + '/' + id + '?includeSelf=false' },
    { isTransformResponse: true }
  );
};

/**
 * 修改数据分类
 */
export const updateApi = (dataClassify: DataClassify) => {
  return defHttp.put({ url: Api.Update, params: dataClassify }, { isTransformResponse: true });
};

/**
 * 获取单条数据分类
 */
export const getApi = async (id: string) => {
  const response = await defHttp.get({ url: Api.Get + '/' + id });
  return response.data?.data;
};

/**
 * 获取数据分类树
 */
export const getTreeApi = async () => {
  const response = await defHttp.get({ url: Api.GetTree });
  return response.data?.data;
};
/**
 * 获取数据分类树
 */
export const getTreeAsPromiseApi = async () => {
  return defHttp.get({ url: Api.GetTree });
};
