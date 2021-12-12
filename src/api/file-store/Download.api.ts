import { defHttp } from '/@/utils/http/axios';

enum Api {
  Download = '/sys/file/download',
  Base64 = '/sys/file/base64',
  GetUrl = '/sys/file/url',
}

/**
 * 文件下载
 */
export const downloadFileApi = (fileId: string) => {
  return defHttp.get({ url: Api.Download + '/' + fileId });
};

/**
 * 获取下载链接
 */
export const getDownloadUrlApi = (fileId: string) => {
  return defHttp.getOptions().requestOptions.apiUrl + Api.Download + '/' + fileId;
};

/**
 * 获取文件base64
 */
export const getFileBase64Api = async (fileId: string) => {
  const response = await defHttp.get(
    { url: Api.Base64 + '/' + fileId },
    { isTransformResponse: true }
  );
  return response.data?.data;
};

/**
 * 获取文件链接
 */
export const getFileUrlApi = async (fileId: string) => {
  const response = await defHttp.get(
    { url: Api.GetUrl + '/' + fileId },
    { isTransformResponse: true }
  );
  return response.data?.data;
};
