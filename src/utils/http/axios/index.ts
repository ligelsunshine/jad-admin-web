// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosResponse } from 'axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMessage';
import { RequestEnum, ContentTypeEnum } from '/@/enums/httpEnum';
import { isString } from '/@/utils/is';
import { getToken } from '/@/utils/auth';
import { setObjToUrlParams, deepMerge } from '/@/utils';
import { useI18n } from '/@/hooks/web/useI18n';
import { joinTimestamp, formatRequestDate } from './helper';
import { SessionTimeoutProcessingEnum } from '/@/enums/appEnum';
import { useUserStoreWithOut } from '/@/store/modules/user';
import projectSetting from '/@/settings/projectSetting';

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const { createMessage, createErrorModal } = useMessage();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    const token = getToken();
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      config.headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (response: AxiosResponse<any>) => {
    const { code, msg, data } = response.data;
    response.status = code;

    if (code == 400) {
      createMessage.error(msg);
      console.error(msg, data);
      throw new Error(msg);
    } else if (code == 500) {
      createErrorModal({ title: msg, content: data });
      console.error(msg, data);
      throw new Error(msg);
    }
    return response;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { t } = useI18n();
    const { config, response, message } = error || {};
    const status: number = response?.status;
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const userStore = useUserStoreWithOut();
    const stp = projectSetting.sessionTimeoutProcessing;
    let msg = '';
    try {
      if (message?.includes('Network Error')) {
        msg = t('sys.api.networkExceptionMsg');
      } else if (message?.indexOf('timeout') !== -1) {
        msg = t('sys.api.apiTimeoutMessage');
      } else if (status == 400) {
        // msg = response?.data?.msg || t('sys.api.errMsg400');
        createMessage.error(response?.data?.msg);
        console.error(response?.data?.msg, response?.data?.data);
        return Promise.reject(error);
      } else if (status == 401) {
        msg = response?.data?.msg || t('sys.api.errMsg401');
        if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
          userStore.setToken(undefined);
          userStore.setSessionTimeout(true);
        } else {
          userStore.logout(true);
        }
        createMessage.warning(msg);
        return Promise.reject(error);
      } else if (status == 403) {
        msg = response?.data?.msg || t('sys.api.errMsg403');
      } else if (status == 404) {
        msg = response?.data?.msg || t('sys.api.errMsg404');
      } else if (status == 405) {
        msg = response?.data?.msg || t('sys.api.errMsg405');
      } else if (status == 408) {
        msg = response?.data?.msg || t('sys.api.errMsg408');
      } else if (status == 500) {
        // msg = response?.data?.msg || t('sys.api.errMsg500');
        createErrorModal({ title: response?.data?.msg, content: response?.data?.data });
        return Promise.reject(error);
      } else if (status == 501) {
        msg = response?.data?.msg || t('sys.api.errMsg501');
      } else if (status == 502) {
        msg = response?.data?.msg || t('sys.api.errMsg502');
      } else if (status == 503) {
        msg = response?.data?.msg || t('sys.api.errMsg503');
      } else if (status == 504) {
        msg = response?.data?.msg || t('sys.api.errMsg504');
      } else if (status == 505) {
        msg = response?.data?.msg || t('sys.api.errMsg505');
      } else {
        msg = response?.data?.msg || t('sys.api.errorMessage');
      }
      if (msg) {
        if (errorMessageMode === 'modal') {
          createErrorModal({ title: t('sys.api.errorTip'), content: msg });
        } else if (errorMessageMode === 'message') {
          createMessage.error(msg);
        }
      }
    } catch (error) {
      throw new Error(error);
    }
    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        // 接口可能会有通用的地址部分，可以统一抽取出来
        urlPrefix: urlPrefix,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
      },
      opt || {}
    )
  );
}
export const defHttp = createAxios();

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//   },
// });
