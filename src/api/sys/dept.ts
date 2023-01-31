import { defHttp } from '/@/utils/http/axios';

enum Api {
  Save = '/sys/dept/save',
  Delete = '/sys/dept/delete',
  Update = '/sys/dept/update',
  Get = '/sys/dept/get',
  GetDeptTree = '/sys/dept/getDeptTree',
}

/**
 * 添加
 */
export const saveDept = (dept) => {
  return defHttp.post({ url: Api.Save, params: dept });
};
/**
 * 删除
 */
export const deleteDept = (id: string) => {
  return defHttp.delete({ url: Api.Delete + '/' + id + '?includeSelf=true' });
};
/**
 * 删除子部门
 */
export const deleteDeptChildren = (id: string) => {
  return defHttp.delete({ url: Api.Delete + '/' + id + '?includeSelf=false' });
};
/**
 * 修改
 */
export const updateDept = (dept) => {
  return defHttp.put({ url: Api.Update, params: dept });
};
/**
 * 获取单条部门
 */
export const getDept = async (id: string) => {
  const response = await defHttp.get({ url: Api.Get + '/' + id });
  return response.data?.data;
};
/**
 * 获取部门树
 */
export const getDeptTree = async () => {
  const response = await defHttp.get({ url: Api.GetDeptTree });
  return response.data?.data;
};
/**
 * 获取部门树
 */
export const getDeptTreeAsPromise = async () => {
  return defHttp.get({ url: Api.GetDeptTree });
};
