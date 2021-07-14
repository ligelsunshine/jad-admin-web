import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetMenuList = '/sys/user/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get({ url: Api.GetMenuList });
};
