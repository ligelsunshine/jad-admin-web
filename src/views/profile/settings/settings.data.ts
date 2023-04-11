import { FormSchema } from '/@/components/Form';

// tab的list
export const settingList = [
  {
    key: '1',
    name: '基本设置',
    icon: 'ic:outline-info',
    component: 'BasicSettings',
    auth: 'profile:settings:base',
  },
  {
    key: '2',
    name: '安全设置',
    icon: 'ic:baseline-security',
    component: 'SecureSettings',
    auth: 'profile:settings:security',
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

// 安全设置 form
export const secureSettingsSchema: FormSchema[] = [
  {
    field: 'oldPassword',
    label: '当前密码',
    component: 'InputPassword',
    required: true,
  },
  {
    field: 'newPassword',
    label: '新密码',
    component: 'StrengthMeter',
    componentProps: {
      placeholder: '新密码',
    },
    rules: [
      {
        required: true,
        message: '请输入新密码',
      },
    ],
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'InputPassword',

    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('密码不能为空');
            }
            if (value !== values.newPassword) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];
