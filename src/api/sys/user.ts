import { defHttp } from '/@/utils/http/axios';
import { LoginParams } from './model/userModel';

import qs from 'qs';

enum Api {
  Login = '/auth/login',
  Logout = '/auth/logout',
  GetPicCaptcha = '/auth/captcha',
  GetUserInfo = '/sys/user/currentUser',
  GetPermCode = '/sys/user/getPermCode',
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
