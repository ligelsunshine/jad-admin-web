import { h } from 'vue';
import { DescItem } from '/@/components/Description';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { Icon } from '/@/components/Icon';
import { Tag } from 'ant-design-vue';

export interface MenuType {
  type: number;
  text?: string;
  icon?: string;
  color?: string;
}
export const folderIcon = 'ant-design:folder-open-outlined';
export const menuIcon = 'ant-design:file-text-outlined';
export const buttonIcon = 'codicon:symbol-interface';
export function getMenuType(type: number): MenuType {
  let menuType: MenuType = { type: type };
  if (type == 0) {
    menuType = {
      type: type,
      text: '目录',
      icon: folderIcon,
      color: 'orange',
    };
  } else if (type == 1) {
    menuType = {
      type: type,
      text: '菜单',
      icon: menuIcon,
      color: 'green',
    };
  } else if (type == 2) {
    menuType = {
      type: type,
      text: '按钮',
      icon: buttonIcon,
      color: 'green',
    };
  }
  return menuType;
}

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
      const menuType = getMenuType(record.type);
      return h(Tag, { color: menuType?.color }, () => menuType?.text);
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
    width: 300,
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

// const isDir = (type: number) => type === 0;
export const isMenu = (type: number) => type === 1;
export const isButton = (type: number) => type === 2;

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
    field: 'code',
    label: '菜单编码',
    component: 'Input',
    helpMessage: '菜单唯一编码，仅数字、字母、中横线组成',
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
    field: 'name',
    label: '路由名称',
    component: 'Input',
    show: ({ values }) => isMenu(values.type),
    helpMessage:
      '路由名称尽量唯一，不写默认自动生成，可以通过组件名称做页面缓存（切换标签页不刷新页面）',
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
    show: ({ values }) => isButton(values.type),
  },
  {
    field: 'frameSrc',
    label: '外部嵌套地址',
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
    field: 'hideTab',
    label: '隐藏标签页',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '否', value: false },
        { label: '是', value: true },
      ],
    },
    helpMessage: '当前路由不再标签页显示',
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
    helpMessage: '当前路由不再菜单显示',
    show: ({ values }) => !isButton(values.type),
  },
  {
    field: 'hideChildrenInMenu',
    label: '隐藏子菜单',
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '否', value: false },
        { label: '是', value: true },
      ],
    },
    helpMessage: '隐藏所有子菜单',
    show: ({ values }) => !isButton(values.type),
  },
];

export const descSchema: DescItem[] = [
  {
    field: 'type',
    label: '菜单类型',
    span: 2,
    render: (val) => {
      const menuType = getMenuType(val);
      return h('p', [h(Icon, { icon: menuType?.icon }), ' ' + menuType?.text]);
    },
  },
  {
    field: 'title',
    label: '菜单标题',
    span: 2,
  },
  {
    field: 'orderNo',
    label: '排序',
  },
  {
    field: 'code',
    label: '菜单编码',
  },
  {
    field: 'icon',
    label: '图标',
    render: (val) => {
      return h(Icon, {
        icon: val,
      });
    },
    show: (record) => !isButton(record.type),
  },
  {
    field: 'path',
    label: '路由地址',
    show: (record) => !isButton(record.type),
  },
  {
    field: 'name',
    label: '路由名称',
    show: (record) => isMenu(record.type),
  },
  {
    field: 'component',
    label: '组件路径',
    show: (record) => isMenu(record.type),
  },
  {
    field: 'permissions',
    label: '权限标识',
    show: (record) => isButton(record.type),
  },
  {
    field: 'frameSrc',
    label: '外部嵌套地址',
    show: (record) => isMenu(record.type),
  },
  {
    field: 'status',
    label: '状态',
    render: (val) => {
      return val == 1 ? '停用' : '启用';
    },
  },
  {
    field: 'external',
    label: '是否外链',
    render: (val) => {
      return val ? '是' : '否';
    },
    show: (record) => isMenu(record.type),
  },
  {
    field: 'ignoreKeepAlive',
    label: '是否忽略缓存',
    render: (val) => {
      return val ? '是' : '否';
    },
    show: (record) => isMenu(record.type),
  },
  {
    field: 'hideChildrenInMenu',
    label: '隐藏子菜单',
    render: (val) => {
      return val ? '是' : '否';
    },
    show: (record) => !isButton(record.type),
  },
  {
    field: 'hideMenu',
    label: '是否隐藏',
    render: (val) => {
      return val ? '是' : '否';
    },
    show: (record) => !isButton(record.type),
  },
];
