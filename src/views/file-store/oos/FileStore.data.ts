import { BasicColumn, FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import { formatToDateTime } from '/@/utils/dateUtil';

/**
 * Entity
 */
export interface FileStore {
  id: string;
  groupId?: string;
  name?: string;
  type?: string;
  size?: number;
  path?: string;
  md5?: string;
  memi?: string;
  accessPolicy?: AccessPolicy;
  store?: Store;
}

/**
 * 访问策略枚举
 */
export enum AccessPolicy {
  PUBLIC = 0,
  PRIVATE = 1,
}

/**
 * 访问策略渲染
 *
 * @param accessPolicy 访问策略
 */
export function renderOfAccessPolicy(accessPolicy) {
  switch (accessPolicy) {
    case AccessPolicy.PUBLIC:
      return '公开';
    case AccessPolicy.PRIVATE:
      return '私有';
    default:
      return 'undefined';
  }
}

/**
 * 存储源枚举
 */
export enum Store {
  LOCAL = 0,
  MINIO = 1,
  QINIU = 2,
  ALIYUN = 3,
  TENCENT = 4,
}

/**
 * 存储源渲染
 *
 * @param store 存储源
 */
export function renderOfStore(store) {
  switch (store) {
    case Store.LOCAL:
      return '本地存储';
    case Store.MINIO:
      return 'minio存储';
    case Store.QINIU:
      return '七牛云';
    case Store.ALIYUN:
      return '阿里云';
    case Store.TENCENT:
      return '腾讯云';
    default:
      return 'undefined';
  }
}

/**
 * 上传类型
 */
export enum UploadType {
  AVATAR = 0,
  OTHER = 1,
}

/**
 * 上传类型渲染
 *
 * @param uploadType 上传类型
 */
export function renderOfUploadType(uploadType) {
  switch (uploadType) {
    case UploadType.AVATAR:
      return '头像';
    case UploadType.OTHER:
      return '其他';
    default:
      return 'undefined';
  }
}

/**
 * 列表显示字段
 */
export const columns: BasicColumn[] = [
  {
    dataIndex: 'id',
    title: 'FileID',
  },
  {
    dataIndex: 'groupId',
    title: '分组',
  },
  {
    dataIndex: 'name',
    title: '名称',
  },
  {
    dataIndex: 'type',
    title: '类型',
  },
  {
    dataIndex: 'size',
    title: '大小',
  },
  {
    dataIndex: 'path',
    title: '路径',
  },
  {
    dataIndex: 'md5',
    title: 'MD5',
  },
  {
    dataIndex: 'memi',
    title: 'MEMI类型',
  },
  {
    dataIndex: 'accessPolicy',
    title: '访问策略',
    customRender: ({ record }) => renderOfAccessPolicy(record.accessPolicy),
  },
  {
    dataIndex: 'store',
    title: '存储源',
    customRender: ({ record }) => renderOfStore(record.store),
  },
  {
    dataIndex: 'createTime',
    title: '创建时间',
    width: '200px',
    customRender: ({ record }) => (record.createTime ? formatToDateTime(record.createTime) : ''),
  },
];

/**
 * 查询表单
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'store',
    label: '存储源',
    component: 'Select',
    componentProps: {
      options: [
        { label: '本地存储', value: Store.LOCAL },
        { label: 'minio存储', value: Store.MINIO },
        { label: '七牛云', value: Store.QINIU },
        { label: '阿里云', value: Store.ALIYUN },
        { label: '腾讯云', value: Store.TENCENT },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'rangeTime',
    label: '创建时间',
    component: 'RangePicker',
    colProps: { span: 8 },
  },
];

/**
 * 详情
 */
export const descSchema: DescItem[] = [
  {
    field: 'groupId',
    label: '分组',
  },
  {
    field: 'name',
    label: '名称',
  },
  {
    field: 'type',
    label: '类型',
  },
  {
    field: 'size',
    label: '大小',
  },
  {
    field: 'path',
    label: '路径',
  },
  {
    field: 'md5',
    label: 'MD5',
  },
  {
    field: 'memi',
    label: 'MEMI类型',
  },
  {
    field: 'accessPolicy',
    label: '访问策略',
    render: (val) => renderOfAccessPolicy(val),
  },
  {
    field: 'store',
    label: '存储源',
    render: (val) => renderOfStore(val),
  },
  {
    field: 'createTime',
    label: '创建时间',
    render: (val) => (val ? formatToDateTime(val) : ''),
  },
  {
    field: 'updateTime',
    label: '修改时间',
    render: (val) => (val ? formatToDateTime(val) : ''),
  },
  {
    field: 'remark',
    label: '备注',
  },
];
