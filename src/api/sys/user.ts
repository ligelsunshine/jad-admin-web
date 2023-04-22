import { defHttp } from '/@/utils/http/axios';
import { LoginParams } from './model/userModel';
import qs from 'qs';

import headerImg from '/@/assets/images/header.png';
import { getFileBase64Api } from '/@/api/file-store/Download.api';

enum Api {
  Login = '/auth/login',
  Logout = '/auth/logout',
  GetPicCaptcha = '/auth/captcha',
  GetUserInfo = '/sys/user/currentUser',
  GetPermCode = '/sys/user/getPermCode',
  Save = '/sys/user/save',
  Delete = '/sys/user/delete',
  Update = '/sys/user/update',
  UpdateBaseInfo = '/sys/user/updateBaseInfo',
  UpdatePassword = '/sys/user/updatePassword',
  Get = '/sys/user/get',
  GetListPage = '/sys/user/get/page',
  SearchUser = '/sys/user/searchUser',
}

interface PermCode {
  superRole: string;
  codeList: string[];
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams) {
  return defHttp.post(
    { url: Api.Login + '?' + qs.stringify(params) },
    { isTransformResponse: true }
  );
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

/**
 * 获取用户头像的base64
 * @param avatar 头像ID
 */
export async function getUserAvatar(avatar: string) {
  let avatarBase64;
  try {
    avatarBase64 = await getFileBase64Api(avatar);
  } catch (e) {
    // ignore
  }
  return avatarBase64 || headerImg;
}

export async function getPermCode(): Promise<PermCode> {
  const permCode: PermCode = {
    superRole: '',
    codeList: [],
  };
  const response = await defHttp.get({ url: Api.GetPermCode });
  const data = response.data?.data;
  permCode.superRole = data?.superRole;
  permCode.codeList = data?.codeList;
  return permCode;
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
 * 修改用户基础信息
 */
export const updateUserBaseInfo = (user) => {
  return defHttp.put({ url: Api.UpdateBaseInfo, params: user }, { isTransformResponse: true });
};
/**
 * 修改用户密码
 */
export const updatePassword = (updatePasswordForm: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return defHttp.put(
    { url: Api.UpdatePassword, params: updatePasswordForm },
    { isTransformResponse: true }
  );
};
/**
 * 获取单个用户
 */
export const getUser = async (id) => {
  return defHttp.get({ url: Api.Get + '/' + id });
};
/**
 * 分页获取
 */
export const getUserListPage = async (params) => {
  const response = await defHttp.post({ url: Api.GetListPage, params: params });
  return response.data?.data;
};
/**
 * 搜索用户
 */
export const searchUser = async ({ keyword }) => {
  const response = await defHttp.get({ url: Api.SearchUser + '?keyword=' + keyword });
  return response.data?.data;
};
