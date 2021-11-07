import { BasicColumn, FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import { formatToDateTime } from '/@/utils/dateUtil';

/**
 * Entity
 */
export interface Dict {
  id: string;
  title?: string;
  code?: string;
}

/**
 * 列表显示字段
 */
export const columns: BasicColumn[] = [
  {
    dataIndex: 'title',
    title: '字典名称',
  },
  {
    dataIndex: 'code',
    title: '字典编码',
  },
  {
    dataIndex: 'remark',
    title: '备注',
  },
];

/**
 * 查询表单
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '字典名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'code',
    label: '字典编码',
    component: 'Input',
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
    field: 'title',
    label: '字典名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'code',
    label: '字典编码',
    component: 'Input',
    required: true,
    rules: [
      { required: true, message: '仅字母和数字组成', pattern: /^[0-9a-zA-Z]+$/, trigger: 'blur' },
    ],
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
    colProps: {
      span: 24,
    },
  },
];

/**
 * 详情
 */
export const descSchema: DescItem[] = [
  {
    field: 'title',
    label: '字典名称',
  },
  {
    field: 'code',
    label: '字典编码',
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
