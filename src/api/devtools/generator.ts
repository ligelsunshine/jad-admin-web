import { defHttp } from '/@/utils/http/axios';
import { FieldSchema } from '/@/views/devtools/generator/generator.data';
import { SearchForm } from '/@/components/Table';
import { stringify } from 'qs';

enum Api {
  Save = '/devtools/generator/save',
  SaveField = '/devtools/generator/saveField',
  Delete = '/devtools/generator/delete',
  DeleteField = '/devtools/generator/deleteField',
  Update = '/devtools/generator/update',
  UpdateField = '/devtools/generator/updateField',
  Get = '/devtools/generator/get',
  GetPage = '/devtools/generator/get/page',
  GetModule = '/devtools/generator/getModule',
  GenerateTable = '/devtools/generator/table',
  GenerateBack = '/devtools/generator/back',
  GenerateFront = '/devtools/generator/front',
}

/**
 * 添加Model
 */
export const saveApi = (generator: Generator) => {
  return defHttp.post({ url: Api.Save, params: generator }, { isTransformResponse: true });
};
/**
 * 添加Field
 */
export const saveFieldApi = (id, fieldSchema: FieldSchema) => {
  return defHttp.post(
    { url: Api.SaveField + '/' + id, params: fieldSchema },
    { isTransformResponse: true }
  );
};

/**
 * 删除Model
 */
export const deleteApi = (id) => {
  return defHttp.delete({ url: Api.Delete + '/' + id }, { isTransformResponse: true });
};
/**
 * 删除Field
 */
export const deleteFieldApi = (id, fieldId) => {
  return defHttp.delete(
    { url: Api.DeleteField + '/' + id + '?' + stringify({ fieldId: fieldId }) },
    { isTransformResponse: true }
  );
};

/**
 * 修改Model
 */
export const updateApi = (generator: Generator) => {
  return defHttp.put({ url: Api.Update, params: generator }, { isTransformResponse: true });
};

/**
 * 修改Field
 */
export const updateFieldApi = (id, fieldSchema: FieldSchema) => {
  return defHttp.put(
    { url: Api.UpdateField + '/' + id, params: fieldSchema },
    { isTransformResponse: true }
  );
};

/**
 * 获取单条Model
 */
export const getApi = async (id) => {
  return defHttp.get({ url: Api.Get + '/' + id });
};

/**
 * 分页获取Model
 */
export const getPageApi = async (params: SearchForm) => {
  const response = await defHttp.post({ url: Api.GetPage, params: params });
  return response.data?.data;
};

/**
 * 获取module树
 */
export const getModuleApi = async () => {
  const response = await defHttp.get({ url: Api.GetModule });
  return response.data?.data;
};
/**
 * 生成数据库表
 */
export const generateTableApi = (id) => {
  return defHttp.post({ url: Api.GenerateTable + '/' + id }, { isTransformResponse: true });
};

/**
 * 生成后端代码
 */
export const GenerateBackApi = (id) => {
  return defHttp.post({ url: Api.GenerateBack + '/' + id }, { isTransformResponse: true });
};

/**
 * 生成前端代码
 */
export const GenerateFrontApi = (id) => {
  return defHttp.post({ url: Api.GenerateFront + '/' + id }, { isTransformResponse: true });
};
