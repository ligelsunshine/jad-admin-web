import { BasicColumn, FormSchema } from '/@/components/Table';

/**
 * Entity
 */
export interface DictData {
  id: string;
  dictId?: string;
  name?: string;
  value?: string;
  orderNo?: number;
}

/**
 * 列表显示字段
 */
export const columns: BasicColumn[] = [
  {
    dataIndex: 'name',
    title: '名称',
  },
  {
    dataIndex: 'value',
    title: '数据值',
  },
  {
    dataIndex: 'orderNo',
    title: '排序',
  },
];

/**
 * 查询表单
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'dictId',
    label: '字典ID',
    component: 'IDInput',
    colProps: { span: 8 },
    show: false,
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
    field: 'dictId',
    label: '字典ID',
    component: 'Input',
    required: true,
    show: false,
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'value',
    label: '数据值',
    component: 'Input',
    required: true,
  },
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
  },
];
