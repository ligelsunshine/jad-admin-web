import { Image } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import { h } from 'vue';
import { getFilePreviewUrlApi } from '/@/api/file-store/Download.api';
import headerImg from '/@/assets/images/header.png';

export const columns: BasicColumn[] = [
  {
    title: '头像',
    dataIndex: 'avatar',
    customRender: ({ record }) => {
      const avatar = getFilePreviewUrlApi(record.avatar);
      return h(Image, { src: avatar, width: 45, height: 45, fallback: headerImg });
    },
  },
  {
    title: '账号',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'name',
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

export const userSchema: DescItem[] = [
  {
    field: 'username',
    label: '用户名',
  },
  {
    field: 'phone',
    label: '手机号',
  },
  {
    field: 'email',
    label: '邮箱',
  },
  {
    field: 'name',
    label: '姓名',
  },
  {
    field: 'sex',
    label: '性别',
    render: (val) => {
      const sex = `${val}`;
      let icon;
      if (sex == `1`) {
        icon = 'ant-design:man-outlined';
      } else if (sex == `2`) {
        icon = 'ant-design:woman-outlined';
      } else {
        icon = 'ant-design:question-circle-outlined';
      }
      return h(Icon, {
        icon: icon,
        size: '20px',
      });
    },
  },
  {
    field: 'age',
    label: '年龄',
  },
  {
    field: 'birthday',
    label: '出生年月',
  },
  {
    field: 'city',
    label: '所在城市',
  },
  {
    field: 'lastLogin',
    label: '最后登录时间',
  },
  {
    field: 'remark',
    label: '备注',
  },
  {
    field: 'createTime',
    label: '创建时间',
  },
  {
    field: 'updateTime',
    label: '修改时间',
  },
];
