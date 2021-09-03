export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
  // 将请求参数拼接到url
  joinParamsToUrl?: boolean;
  // 格式请求参数时间
  formatDate?: boolean;
  // 是否处理请求结果
  isTransformResponse?: boolean;
  // 返回数据进行处理消息提示类型
  messageMode?: string;
  // 是否返回本机响应头
  // 例如:当你需要获得响应头时使用这个属性
  isReturnNativeResponse?: boolean;
  // 是否加入url
  joinPrefix?: boolean;
  // 接口地址，使用默认apiUrl，如果你让它为空
  apiUrl?: string;
  // 错误消息提示类型
  errorMessageMode?: ErrorMessageMode;
  // 是否添加时间戳
  joinTime?: boolean;
  ignoreCancelToken?: boolean;
  // Whether to send token in header
  withToken?: boolean;
}

export interface Result<T = any> {
  code: number;
  msg: string;
  data: T;
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Recordable;
  // File parameter interface field name
  name?: string;
  // file name
  file: File | Blob;
  // file name
  filename?: string;
  [key: string]: any;
}
