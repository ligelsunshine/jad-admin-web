import { defHttp } from '/@/utils/http/axios';
import { openWindow } from '/@/utils';
import { getApi as getFileStoreApi } from '/@/api/file-store/oos/FileStore.api';
import { Store } from '/@/views/file-store/oos/FileStore.data';
import { stringify } from "qs";

enum Api {
  Download = '/sys/file/download',
  Base64 = '/sys/file/base64',
  GetUrl = '/sys/file/url',
  Preview = '/sys/file/preview',
}

/**
 * 文件下载
 */
export const downloadFileApi = (fileId: string) => {
  openWindow(defHttp.getOptions().requestOptions?.apiUrl + Api.Download + '/' + fileId, {
    target: '_blank',
  });
};

/**
 * 获取下载链接
 */
export const getDownloadUrlApi = (fileId: string) => {
  return defHttp.getOptions().requestOptions?.apiUrl + Api.Download + '/' + fileId;
};

/**
 * 获取文件base64
 */
export const getFileBase64Api = async (fileId: string) => {
  const response = await defHttp.get(
    { url: Api.Base64 + '?' + stringify({ fileId: fileId }) },
    { isTransformResponse: false }
  );
  return response.data?.data;
};

/**
 * 获取文件下载链接
 */
export const getFileDownloadUrlApi = async (fileId: string) => {
  const result = await getFileStoreApi(fileId);
  if (result.store == Store.LOCAL) {
    return defHttp.getOptions().requestOptions?.apiUrl + Api.Download + '/' + fileId;
  }
  const response = await defHttp.get(
    { url: Api.GetUrl + '/' + fileId },
    { isTransformResponse: true }
  );
  return response.data?.data;
};

/**
 * 获取文件预览链接
 */
export const getFilePreviewUrlApi = (fileId: string) => {
  if (!fileId) {
    return '';
  }
  return defHttp.getOptions().requestOptions?.apiUrl + Api.Preview + '/' + fileId;
};
