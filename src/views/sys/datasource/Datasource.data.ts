import { BasicColumn, FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import { formatToDateTime } from '/@/utils/dateUtil';

/**
 * Entity
 */
export interface Datasource {
  id: string;
  name?: string;
  type?: Type;
  url?: string;
  username?: string;
  password?: string;
}

/**
 * 类型枚举
 */
export enum Type {
  Oracle = 0,
  MySQL = 1,
  DB2 = 2,
  PostgreSQL = 3,
  H2 = 4,
}

/**
 * 类型渲染
 *
 * @param type 类型
 */
export function renderOfType(type) {
  switch (type) {
    case Type.Oracle:
      return 'Oracle';
    case Type.MySQL:
      return 'MySQL';
    case Type.DB2:
      return 'DB2';
    case Type.PostgreSQL:
      return 'PostgreSQL';
    case Type.H2:
      return 'H2';
    default:
      return 'undefined';
  }
}

/**
 * 列表显示字段
 */
export const columns: BasicColumn[] = [
  {
    dataIndex: 'name',
    title: '数据库名称',
  },
  {
    dataIndex: 'type',
    title: '类型',
    customRender: ({ record }) => renderOfType(record.type),
  },
  {
    dataIndex: 'url',
    title: 'URL',
  },
  {
    dataIndex: 'username',
    title: '用户名',
  },
  {
    dataIndex: 'password',
    title: '密码',
  },
];

/**
 * 查询表单
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '数据库名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'Oracle', value: Type.Oracle },
        { label: 'MySQL', value: Type.MySQL },
        { label: 'DB2', value: Type.DB2 },
        { label: 'PostgreSQL', value: Type.PostgreSQL },
        { label: 'H2', value: Type.H2 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'url',
    label: 'URL',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
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
 * 添加/编辑表单
 */
export const formSchema: FormSchema[] = [
  {
    field: '_isUpdate',
    label: '',
    component: 'Switch',
    show: false,
  },
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '数据库名称',
    component: 'Input',
  },
  {
    field: 'type',
    label: '类型',
    component: 'Select',
    defaultValue: Type.MySQL,
    componentProps: {
      options: [
        { label: 'Oracle', value: Type.Oracle },
        { label: 'MySQL', value: Type.MySQL },
        { label: 'DB2', value: Type.DB2 },
        { label: 'PostgreSQL', value: Type.PostgreSQL },
        { label: 'H2', value: Type.H2 },
      ],
    },
  },
  {
    field: 'url',
    label: 'URL',
    component: 'Input',
    required: true,
  },
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    required: true,
  },
  {
    field: 'password',
    label: '密码',
    component: 'Input',
    required: true,
  },
];

/**
 * 详情
 */
export const descSchema: DescItem[] = [
  {
    field: 'name',
    label: '数据库名称',
  },
  {
    field: 'type',
    label: '类型',
    render: (val) => renderOfType(val),
  },
  {
    field: 'url',
    label: 'URL',
  },
  {
    field: 'username',
    label: '用户名',
  },
  {
    field: 'password',
    label: '密码',
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
