import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { ComponentType } from '/@/components/Form/src/types';
import { DescItem } from '/@/components/Description';
import { h } from 'vue';
import { Switch, Tag } from 'ant-design-vue';

interface BaseField {
  module?: string;
  title?: string;
  name?: string;
  namespace?: string;
  mainField?: string;
  treeModel?: boolean;
  logic?: boolean;
}

export interface Generator extends BaseField {
  ds?: string;
  modelJson?: string;
  model?: Model;
  value?: any;
}

export interface Model extends BaseField {
  fieldSchema?: FieldSchema[];
  generateConfig?: GenerateConfig;
}

export interface FieldSchema {
  title?: string;
  name?: string;
  type?: FieldType;
  component?: ComponentType;
  defaultVal?: any;
  enumVal?: EnumVal[];
  require?: boolean;
  orderNo?: number;
  rules?: Rule[];
}

export interface Rule {
  type?: RuleType;
  len?: number;
  min?: number;
  max?: number;
  message?: string;
  pattern?: string;
}

export type RuleType =
  | 'STRING_LEN'
  | 'STRING_RANGE'
  | 'NUMBER'
  | 'INTEGER'
  | 'FLOAT'
  | 'URL'
  | 'EMAIL'
  | 'PHONE'
  | 'REGEXP';

export type FieldType =
  | 'STRING'
  | 'TEXT'
  | 'INT'
  | 'FLOAT'
  | 'DOUBLE'
  | 'LONG'
  | 'DECIMAL'
  | 'BOOLEAN'
  | 'DATE'
  | 'ENUM'
  | 'OBJECT';

export interface EnumVal {
  title?: string;
  name?: string;
}

export interface GenerateConfig {
  entity?: boolean;
  mapper?: boolean;
  mapperXml?: boolean;
  service?: boolean;
  serviceImpl?: boolean;
  controller?: boolean;
}

export const columns: BasicColumn[] = [
  {
    title: '数据源（DS）',
    dataIndex: 'ds',
    width: 200,
  },
  {
    title: 'Module',
    dataIndex: 'module',
    width: 180,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    width: 180,
  },
  {
    title: 'Namespace',
    dataIndex: 'namespace',
    width: 180,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 180,
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'ds',
    label: '数据源（DS）',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'module',
    label: 'Module',
    component: 'Input',
    colProps: { span: 6 },
    show: false,
  },
  {
    field: 'title',
    label: 'Title',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'namespace',
    label: 'Namespace',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'name',
    label: 'name',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'rangeTime',
    label: '创建时间',
    component: 'RangePicker',
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
    field: 'ds',
    label: '数据源(DS)',
    component: 'Input',
    required: true,
  },
  {
    field: 'module',
    label: 'Module',
    component: 'TreeSelect',
    required: true,
    componentProps: {
      replaceFields: {
        title: 'name',
        key: 'name',
        value: 'name',
      },
      getPopupContainer: () => document.body,
    },
    helpMessage: '后端代码工程的module名',
  },
  {
    field: 'title',
    label: 'Title',
    component: 'Input',
    required: true,
    helpMessage: '实体中文名',
  },
  {
    field: 'namespace',
    label: 'Namespace',
    component: 'Input',
    required: true,
    rules: [
      {
        required: true,
        pattern: /^[a-zA-Z]+\w*$/,
        message: '仅数字、字母、下划线，且仅字母开头',
        trigger: 'blur',
      },
    ],
    helpMessage: '域名(数据库表前缀、API接口第一级、前端工程文件夹名)',
  },
  {
    field: 'name',
    label: 'Name',
    component: 'Input',
    required: true,
    rules: [
      {
        required: true,
        pattern: /^[a-zA-Z]+\w*$/,
        message: '仅数字、字母、下划线，且仅字母开头',
        trigger: 'blur',
      },
    ],
    helpMessage: '实体英文名（数据库表名，实体类名）',
  },
  {
    field: 'treeModel',
    label: '是否树形结构',
    component: 'Switch',
    defaultValue: false,
    componentProps: {
      options: [{ value: false }, { value: true }],
    },
  },
  {
    field: 'logic',
    label: '是否逻辑删除',
    component: 'Switch',
    defaultValue: false,
    componentProps: {
      options: [{ value: false }, { value: true }],
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

export const descriptionSchema: DescItem[] = [
  {
    field: 'ds',
    label: '数据源（DS）',
  },
  {
    field: 'module',
    label: 'Module',
  },
  {
    field: 'title',
    label: 'Title',
  },
  {
    field: 'namespace',
    label: 'Namespace',
  },
  {
    field: 'name',
    label: 'Name',
  },
  {
    field: 'treeModel',
    label: '是否树形结构',
    render: (val) => {
      return h(Switch, { checked: `${val}` == `true`, disabled: true });
    },
  },
  {
    field: 'logic',
    label: '是否逻辑删除',
    render: (val) => {
      return h(Switch, { checked: `${val}` == `true`, disabled: true });
    },
  },
  {
    field: 'remark',
    label: '备注',
  },
];

export const fieldColumns: BasicColumn[] = [
  {
    title: '字段标题',
    dataIndex: 'title',
  },
  {
    title: '字段名',
    dataIndex: 'name',
  },
  {
    title: '字段类型',
    dataIndex: 'type',
  },
  {
    title: '组件',
    dataIndex: 'component',
  },
  {
    title: '默认值',
    dataIndex: 'defaultVal',
  },
  {
    title: '是否必须',
    dataIndex: 'require',
    customRender: ({ record }) => {
      return record.require ? 'true' : 'false';
    },
  },
  {
    title: '字段排序',
    dataIndex: 'orderNo',
    width: 200,
    edit: true,
    editRule: true,
    editComponent: 'InputNumber',
  },
  {
    title: '字段控制',
    dataIndex: 'presents',
    width: 300,
    customRender: ({ record }) => {
      return h(
        'div',
        {},
        record.presents.map((present) => {
          let text;
          switch (present) {
            case 'LIST':
              text = '列表展示';
              break;
            case 'ADD_FORM':
              text = '添加表单';
              break;
            case 'EDIT_FORM':
              text = '编辑表单';
              break;
            case 'SEARCH_FORM':
              text = '查询表单';
              break;
            case 'DETAIL':
              text = '详情页展示';
              break;
          }
          return h(Tag, {}, () => text);
        })
      );
    },
  },
];

const isEnum = (type: FieldType) => type === 'ENUM';
const switchComponentProps = (formModel: Recordable) => {
  let props;
  switch (formModel.type) {
    case 'STRING':
    case 'TEXT':
      props = {
        options: [
          { label: '普通文本框（Input）', value: 'Input' },
          { label: '密码框（InputPassword）', value: 'InputPassword' },
          { label: '文本域（InputTextArea）', value: 'InputTextArea' },
          { label: '日期选择器（DatePicker）', value: 'DatePicker' },
          { label: '月份选择器（MonthPicker）', value: 'MonthPicker' },
          { label: '日期范围选择器（RangePicker）', value: 'RangePicker' },
          { label: '周选择器（WeekPicker）', value: 'WeekPicker' },
          { label: '时间选择器（TimePicker）', value: 'TimePicker' },
          { label: '密码强度校验组件（StrengthMeter）', value: 'StrengthMeter' },
          { label: '文件上传（Upload）', value: 'Upload' },
          { label: 'ICON选择器（IconPicker）', value: 'IconPicker' },
        ],
      };
      break;
    case 'INT':
    case 'FLOAT':
    case 'DOUBLE':
    case 'LONG':
    case 'DECIMAL':
      props = {
        options: [
          { label: '数字框（InputNumber）', value: 'InputNumber' },
          { label: '评分（Rate）', value: 'Rate' },
        ],
      };
      break;
    case 'BOOLEAN':
      props = {
        options: [
          { label: '开关（Switch）', value: 'Switch' },
          { label: '下拉框（Select）', value: 'Select' },
          { label: '单选方形按钮组（RadioButtonGroup）', value: 'RadioButtonGroup' },
          { label: '单选圆形按钮组（RadioGroup）', value: 'RadioGroup' },
          { label: '复选框（Checkbox）', value: 'Checkbox' },
          { label: '复选框组（CheckboxGroup）', value: 'CheckboxGroup' },
        ],
      };
      break;
    case 'DATE':
      props = {
        options: [{ label: '日期选择器（DatePicker）', value: 'DatePicker' }],
      };
      break;
    case 'ENUM':
      props = {
        options: [
          { label: '下拉框（Select）', value: 'Select' },
          { label: '单选方形按钮组（RadioButtonGroup）', value: 'RadioButtonGroup' },
          { label: '单选圆形按钮组（RadioGroup）', value: 'RadioGroup' },
        ],
      };
      break;
    case 'OBJECT':
    default:
      props = {
        options: [
          { label: '普通文本框（Input）', value: 'Input' },
          { label: '密码框（InputPassword）', value: 'InputPassword' },
          { label: '文本域（InputTextArea）', value: 'InputTextArea' },
          { label: '数字框（InputNumber）', value: 'InputNumber' },
          { label: '下拉框（Select）', value: 'Select' },
          { label: '单选方形按钮组（RadioButtonGroup）', value: 'RadioButtonGroup' },
          { label: '单选圆形按钮组（RadioGroup）', value: 'RadioGroup' },
          { label: '复选框（Checkbox）', value: 'Checkbox' },
          { label: '复选框组（CheckboxGroup）', value: 'CheckboxGroup' },
          { label: '日期选择器（DatePicker）', value: 'DatePicker' },
          { label: '月份选择器（MonthPicker）', value: 'MonthPicker' },
          { label: '日期范围选择器（RangePicker）', value: 'RangePicker' },
          { label: '周选择器（WeekPicker）', value: 'WeekPicker' },
          { label: '时间选择器（TimePicker）', value: 'TimePicker' },
          { label: '开关（Switch）', value: 'Switch' },
          { label: '密码强度校验组件（StrengthMeter）', value: 'StrengthMeter' },
          { label: '文件上传（Upload）', value: 'Upload' },
          { label: 'ICON选择器（IconPicker）', value: 'IconPicker' },
          { label: '评分（Rate）', value: 'Rate' },
        ],
      };
  }
  formModel.component = props.options[0].value;
  return props;
};
export const fieldFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'title',
    label: '字段标题',
    component: 'Input',
    required: true,
    helpMessage: '字段中文名',
  },
  {
    field: 'name',
    label: '字段名',
    component: 'Input',
    required: true,
    rules: [
      {
        required: true,
        pattern: /^[a-zA-Z]+\w*$/,
        message: '仅数字、字母、下划线，且仅字母开头',
        trigger: 'blur',
      },
    ],
    helpMessage: '字段英文名',
  },
  {
    field: 'type',
    label: '字段类型',
    component: 'Select',
    required: true,
    componentProps: {
      options: [
        { label: 'String', value: 'STRING' },
        { label: 'Text', value: 'TEXT' },
        { label: 'Int', value: 'INT' },
        { label: 'Float', value: 'FLOAT' },
        { label: 'Double', value: 'DOUBLE' },
        { label: 'Long', value: 'LONG' },
        { label: 'Decimal', value: 'DECIMAL' },
        { label: 'Boolean', value: 'BOOLEAN' },
        { label: 'Date', value: 'DATE' },
        { label: 'Enum', value: 'ENUM' },
        { label: 'Object', value: 'OBJECT' },
      ],
    },
    defaultValue: 'STRING',
  },
  {
    field: 'enumVal',
    label: '枚举值',
    component: 'Input',
    slot: 'EnumValSlot',
    show: ({ values }) => isEnum(values.type),
  },
  {
    field: 'defaultVal',
    label: '默认值',
    component: 'Input',
    helpMessage:
      '除字段类型为OBJECT的其他类型字段的默认值。若字段类型为MENU，默认值则应为枚举值的Name属性',
  },
  {
    field: 'component',
    label: '组件',
    defaultValue: 'Input',
    component: 'Select',
    required: true,
    componentProps: ({ formModel }) => switchComponentProps(formModel),
  },
  {
    field: 'orderNo',
    label: '字段排序',
    component: 'InputNumber',
  },
  {
    field: 'require',
    label: '是否必须',
    component: 'Switch',
    componentProps: {
      options: [{ value: false }, { value: true }],
    },
    defaultValue: false,
  },
  {
    field: 'rules',
    label: '自定义校验规则',
    component: 'Input',
    slot: 'RulesSlot',
  },
  {
    field: 'presents',
    label: '字段控制',
    component: 'Select',
    componentProps: {
      mode: 'multiple',
      options: [
        { label: '列表展示', value: 'LIST' },
        { label: '添加表单', value: 'ADD_FORM' },
        { label: '编辑表单', value: 'EDIT_FORM' },
        { label: '查询表单', value: 'SEARCH_FORM' },
        { label: '详情页展示', value: 'DETAIL' },
      ],
    },
    defaultValue: ['LIST', 'ADD_FORM', 'EDIT_FORM', 'DETAIL'],
  },
];
