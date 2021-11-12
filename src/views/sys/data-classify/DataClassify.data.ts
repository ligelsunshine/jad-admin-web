import { FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import { formatToDateTime } from '/@/utils/dateUtil';

/**
 * Entity
 */
export interface DataClassify {
  id: string;
  pId?: string;
  code?: string;
  orderNo?: number;
  title?: string;
  children?: DataClassify[];
}

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
    field: 'pid',
    label: '上级数据分类',
    component: 'TreeSelect',
    componentProps: {
      replaceFields: {
        title: 'title',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'code',
    label: '编码',
    component: 'Input',
    rules: [
      {
        required: false,
        pattern: /[a-zA-Z0-9\-]/,
        message: '仅数字、字母、中横线组成',
        trigger: 'blur',
      },
    ],
    helpMessage: '唯一标识码，仅数字、字母、中横线组成',
  },
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    required: true,
  },
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    defaultValue: 0,
    helpMessage: '默认排序为升序',
  },
];

/**
 * 详情
 */
export const descSchema: DescItem[] = [
  {
    field: 'title',
    label: '标题',
  },
  {
    field: 'code',
    label: '编码',
  },
  {
    field: 'orderNo',
    label: '排序',
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
