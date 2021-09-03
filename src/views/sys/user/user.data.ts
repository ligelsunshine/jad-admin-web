import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '头像',
    dataIndex: 'avatar',
  },
  {
    title: '账号',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '角色',
    dataIndex: 'roles',
    width: 200,
    slots: { customRender: 'roles' },
  },
  {
    title: '部门',
    dataIndex: 'dept',
    width: 200,
    slots: { customRender: 'dept' },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'deptId',
    label: '部门id',
    component: 'Input',
    colProps: { span: 8 },
    show: false,
  },
  {
    field: 'username',
    label: '账号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'rangeTime',
    label: '创建时间',
    component: 'RangePicker',
  },
];

export const formSchemas: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'username',
    label: '账号',
    component: 'Input',
    rules: [
      {
        required: true,
        pattern: /^[A-Za-z0-9@._]{1,16}$/,
        message: '账号只能由 A-Z a-z 0-9 @ . _ 组成',
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
  },
  {
    label: '角色',
    field: 'roleIds',
    slot: 'roleIds',
    component: 'Input',
    required: true,
  },
  {
    field: 'deptId',
    label: '所属部门',
    component: 'TreeSelect',
    componentProps: {
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
  },
  {
    field: 'sex',
    label: '性别',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '不设置', value: 0 },
        { label: '男', value: 1 },
        { label: '女', value: 2 },
      ],
    },
  },
  {
    field: 'age',
    label: '年龄',
    component: 'InputNumber',
  },
  {
    field: 'birthday',
    label: '出生日期',
    component: 'DatePicker',
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    rules: [
      {
        required: false,
        pattern: /^(\w+@(\w+\.)+(\w+))?$/,
        message: '邮箱格式不正确',
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'phone',
    label: '手机号码',
    component: 'Input',
    rules: [
      {
        required: false,
        pattern: /^(1[345789]\d{9})?$/,
        message: '手机号码格式不正确',
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'avatar',
    label: '头像',
    component: 'Input',
  },
  {
    field: 'city',
    label: '所在城市',
    component: 'Input',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
