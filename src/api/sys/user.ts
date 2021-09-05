import { defHttp } from '/@/utils/http/axios';
import { LoginParams } from './model/userModel';

import qs from 'qs';

enum Api {
  Login = '/auth/login',
  Logout = '/auth/logout',
  GetPicCaptcha = '/auth/captcha',
  GetUserInfo = '/sys/user/currentUser',
  GetPermCode = '/sys/user/getPermCode',
  Save = '/sys/user/save',
  Delete = '/sys/user/delete',
  Update = '/sys/user/update',
  Get = '/sys/user/get',
  GetList = '/sys/user/get/list',
  GetListPage = '/sys/user/get/page',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams) {
  return defHttp.post({
    url: Api.Login + '?' + qs.stringify(params),
  });
}

/**
 * @description: getPicCaptcha
 */
export function getPicCaptcha() {
  return defHttp.get({ url: Api.GetPicCaptcha });
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get({ url: Api.GetUserInfo });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

/**
 * 添加
 */
export const saveUser = (user) => {
  return defHttp.post({ url: Api.Save, params: user }, { isTransformResponse: true });
};
/**
 * 删除
 */
export const deleteUser = (id) => {
  return defHttp.delete({ url: Api.Delete + '/' + id }, { isTransformResponse: true });
};
/**
 * 修改
 */
export const updateUser = (user) => {
  return defHttp.put({ url: Api.Update, params: user }, { isTransformResponse: true });
};
/**
 * 获取单个用户
 */
export const getUser = async (id) => {
  return defHttp.get({ url: Api.Get + '/' + id });
};
/**
 * 获取所有
 */
export const getUserList = async () => {
  const response = await defHttp.post({ url: Api.GetList });
  return response.data?.data;
};
/**
 * 分页获取
 */
export const getUserListPage = async (params) => {
  const response = await defHttp.post({ url: Api.GetListPage, params: params });
  return response.data?.data;
};
