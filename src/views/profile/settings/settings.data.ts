import { FormSchema } from '/@/components/Form';

export interface ListItem {
  key: string;
  title: string;
  description: string;
  extra?: string;
  avatar?: string;
  color?: string;
}

// tab的list
export const settingList = [
  {
    key: '1',
    name: '基本设置',
    icon: 'ic:outline-info',
    component: 'BasicSettings',
  },
  {
    key: '2',
    name: '安全设置',
    icon: 'ic:baseline-security',
    component: 'SecureSettings',
  },
];

// 基础设置 form
export const baseSettingsSchemas: FormSchema[] = [
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
    slot: 'username',
  },
  {
    label: '角色',
    field: 'roles',
    component: 'Input',
    slot: 'roles',
  },
  {
    label: '部门',
    field: 'dept',
    component: 'Input',
    slot: 'dept',
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
    field: 'birthday',
    label: '出生日期',
    component: 'DatePicker',
  },
  {
    field: 'age',
    label: '年龄',
    component: 'InputNumber',
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
    show: false,
  },
  {
    field: 'city',
    label: '所在城市',
    component: 'Input',
  },
];

// 安全设置 list
export const secureSettingList: ListItem[] = [
  {
    key: '1',
    title: '账户密码',
    description: '当前密码强度：：强',
    extra: '修改',
  },
  {
    key: '2',
    title: '密保手机',
    description: '已绑定手机：：138****8293',
    extra: '修改',
  },
  {
    key: '3',
    title: '密保问题',
    description: '未设置密保问题，密保问题可有效保护账户安全',
    extra: '修改',
  },
  {
    key: '4',
    title: '备用邮箱',
    description: '已绑定邮箱：：ant***sign.com',
    extra: '修改',
  },
  {
    key: '5',
    title: 'MFA 设备',
    description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
    extra: '修改',
  },
];
