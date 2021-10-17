import { BasicColumn, FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import { formatToDateTime } from '/@/utils/dateUtil';

/**
 * Entity
 */
export interface Datasource {
  id: string;
  code?: string;
  name?: string;
  type?: DBType;
  url?: string;
  username?: string;
  password?: string;
}

/**
 * 类型枚举
 */
export enum DBType {
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
    case DBType.Oracle:
      return 'Oracle';
    case DBType.MySQL:
      return 'MySQL';
    case DBType.DB2:
      return 'DB2';
    case DBType.PostgreSQL:
      return 'PostgreSQL';
    case DBType.H2:
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
    dataIndex: 'code',
    title: '编码',
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
    field: 'code',
    label: '编码',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'Oracle', value: DBType.Oracle },
        { label: 'MySQL', value: DBType.MySQL },
        { label: 'DB2', value: DBType.DB2 },
        { label: 'PostgreSQL', value: DBType.PostgreSQL },
        { label: 'H2', value: DBType.H2 },
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
    field: 'code',
    label: '编码',
    component: 'Input',
    required: true,
    helpMessage: '编码与后端多数据源配置中组名一样，例如：master、salve',
  },
  {
    field: 'type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'Oracle', value: DBType.Oracle },
        { label: 'MySQL', value: DBType.MySQL },
        { label: 'DB2', value: DBType.DB2 },
        { label: 'PostgreSQL', value: DBType.PostgreSQL },
        { label: 'H2', value: DBType.H2 },
      ],
    },
    required: true,
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
    component: 'InputPassword',
    required: true,
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
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
    field: 'code',
    label: '编码',
  },
  {
    field: 'type',
    label: '类型',
    render: (val) => renderOfType(val),
  },
  {
    field: 'url',
    label: 'URL',
    span: 3,
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
