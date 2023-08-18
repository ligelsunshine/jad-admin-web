import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { Switch, Tag } from 'ant-design-vue';
import { usePermission } from '/@/hooks/web/usePermission';
const { hasPermission } = usePermission();

import { updateRoleStatus } from '/@/api/sys/role';

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '角色编码',
    dataIndex: 'code',
    width: 180,
  },
  {
    title: '角色级别',
    dataIndex: 'level',
    width: 180,
  },
  {
    title: '是否默认角色',
    dataIndex: 'defaultRole',
    width: 120,
    customRender: ({ record }) => {
      const defaultRole = record.defaultRole;
      const color = defaultRole ? 'green' : 'red';
      const text = defaultRole ? '默认角色' : '否';
      return h(Tag, { color: color }, () => text);
    },
    ifShow: () => hasPermission('sys:role:update:defaultRole'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.status === 0,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 0 : 1;
          updateRoleStatus(record.id, newStatus)
            .then(() => {
              record.status = newStatus;
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
    ifShow: () => hasPermission('sys:role:update:status'),
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'defaultRole',
    label: '默认角色',
    component: 'Select',
    componentProps: {
      options: [
        { label: '否', value: '0' },
        { label: '默认角色', value: '1' },
      ],
    },
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
  {
    field: 'rangeTime',
    label: '创建时间',
    component: 'RangePicker',
  },
];

export const roleFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'code',
    label: '角色编码',
    required: true,
    component: 'Input',
  },
  {
    field: 'level',
    label: '角色级别',
    component: 'InputNumber',
    defaultValue: 0,
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
    label: '角色描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

export const menuFormSchema: FormSchema[] = [
  {
    label: '',
    field: 'menuIds',
    slot: 'menuIds',
    component: 'Input',
  },
];
