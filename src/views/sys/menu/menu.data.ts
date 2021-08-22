import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';

export const columns: BasicColumn[] = [
  {
    title: '菜单标题',
    dataIndex: 'title',
    width: 180,
    align: 'left',
    fixed: 'left',
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 80,
    customRender: ({ record }) => {
      const type = record.type;
      let color;
      let text;
      if (type == 0) {
        color = 'orange';
        text = '目录';
      } else if (type == 1) {
        color = 'green';
        text = '菜单';
      } else if (type == 2) {
        color = '';
        text = '按钮';
      }
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon });
    },
  },
  {
    title: '路由地址',
    dataIndex: 'path',
    align: 'left',
  },
  {
    title: '权限标识',
    dataIndex: 'permissions',
    align: 'left',
  },
  {
    title: '组件',
    dataIndex: 'component',
    align: 'left',
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
    width: 200,
    edit: true,
    editRule: true,
    editComponent: 'InputNumber',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 0;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
];

const isDir = (type: number) => type === 0;
const isMenu = (type: number) => type === 1;
const isButton = (type: number) => type === 2;

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '菜单标题',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'type',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '目录', value: 0 },
        { label: '菜单', value: 1 },
        { label: '按钮', value: 2 },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'title',
    label: '菜单标题',
    component: 'Input',
    required: true,
  },
  {
    field: 'pid',
    label: '上级菜单',
    component: 'TreeSelect',
    required: ({ values }) => isButton(values.type),
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
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    defaultValue: 0,
    helpMessage: '默认排序为升序',
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    defaultValue: '',
    show: ({ values }) => !isButton(values.type),
  },
  {
    field: 'path',
    label: '路由地址',
    component: 'Input',
    required: ({ values }) => !isButton(values.type),
    show: ({ values }) => !isButton(values.type),
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Input',
    required: ({ values }) => isMenu(values.type),
    show: ({ values }) => isMenu(values.type),
  },
  {
    field: 'permissions',
    label: '权限标识',
    component: 'Input',
    show: ({ values }) => !isDir(values.type),
  },
  {
    field: 'frameSrc',
    label: '外部页面嵌套地址',
    component: 'Input',
    show: ({ values }) => isMenu(values.type),
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
  },
  {
    field: 'external',
    label: '是否外链',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '否', value: false },
        { label: '是', value: true },
      ],
    },
    show: ({ values }) => isMenu(values.type),
  },
  {
    field: 'ignoreKeepAlive',
    label: '是否忽略缓存',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '否', value: false },
        { label: '是', value: true },
      ],
    },
    show: ({ values }) => isMenu(values.type),
  },
  {
    field: 'hideMenu',
    label: '是否隐藏',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '否', value: false },
        { label: '是', value: true },
      ],
    },
    show: ({ values }) => !isButton(values.type),
  },
];
