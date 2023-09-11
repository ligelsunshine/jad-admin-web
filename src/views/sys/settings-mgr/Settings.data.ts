import { FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import { formatToDateTime } from '/@/utils/dateUtil';
import { Status, useDataModel } from '/@/api/data';

const { renderOfStatus } = useDataModel();

/**
 * Entity
 */
export interface Settings {
  id: string;
  pId?: string;
  code?: string;
  orderNo?: number;
  settingType?: SettingType;
  permissions?: string;
  status?: Status;
  title?: string;
  helpMessage?: string;
  component?: Component;
  val?: string;
  require?: boolean;
  enumVal?: string;
  rules?: string;
  componentProps?: string;
  colProps?: string;
  children?: Settings[];
}

/**
 * 设置类型枚举
 */
export enum SettingType {
  DIRECTORY = 0,
  PAGE = 1,
  ITEM = 2,
}

/**
 * 是否是设置项
 * @param type
 */
export const isItem = (type: number) => type === SettingType.ITEM;

/**
 * 设置类型渲染
 *
 * @param settingType 设置类型
 */
export function renderOfSettingType(settingType) {
  switch (settingType) {
    case SettingType.DIRECTORY:
      return '目录';
    case SettingType.PAGE:
      return '设置页';
    case SettingType.ITEM:
      return '设置项';
    default:
      return 'undefined';
  }
}

/**
 * 组件枚举
 */
export enum Component {
  INPUT = 0,
  ID_INPUT = 1,
  INPUT_GROUP = 2,
  INPUT_PASSWORD = 3,
  INPUT_SEARCH = 4,
  INPUT_TEXT_AREA = 5,
  INPUT_NUMBER = 6,
  INPUT_COUNT_DOWN = 7,
  SELECT = 8,
  API_SELECT = 9,
  TREE_SELECT = 10,
  RADIO_BUTTON_GROUP = 11,
  RADIO_GROUP = 12,
  CHECKBOX = 13,
  CHECKBOX_GROUP = 14,
  AUTO_COMPLETE = 15,
  CASCADER = 16,
  DATE_PICKER = 17,
  MONTH_PICKER = 18,
  RANGE_PICKER = 19,
  WEEK_PICKER = 20,
  TIME_PICKER = 21,
  SWITCH = 22,
  STRENGTH_METER = 23,
  UPLOAD = 24,
  ICON_PICKER = 25,
  RENDER = 26,
  SLIDER = 27,
  RATE = 28,
}

/**
 * 组件渲染
 *
 * @param component 组件
 */
export function renderOfComponent(component) {
  switch (component) {
    case Component.INPUT:
      return 'Input';
    case Component.ID_INPUT:
      return 'IdInput';
    case Component.INPUT_GROUP:
      return 'InputGroup';
    case Component.INPUT_PASSWORD:
      return 'InputPassword';
    case Component.INPUT_SEARCH:
      return 'InputSearch';
    case Component.INPUT_TEXT_AREA:
      return 'InputTextArea';
    case Component.INPUT_NUMBER:
      return 'InputNumber';
    case Component.INPUT_COUNT_DOWN:
      return 'InputCountDown';
    case Component.SELECT:
      return 'Select';
    case Component.API_SELECT:
      return 'ApiSelect';
    case Component.TREE_SELECT:
      return 'TreeSelect';
    case Component.RADIO_BUTTON_GROUP:
      return 'RadioButtonGroup';
    case Component.RADIO_GROUP:
      return 'RadioGroup';
    case Component.CHECKBOX:
      return 'Checkbox';
    case Component.CHECKBOX_GROUP:
      return 'CheckboxGroup';
    case Component.AUTO_COMPLETE:
      return 'AutoComplete';
    case Component.CASCADER:
      return 'Cascader';
    case Component.DATE_PICKER:
      return 'DatePicker';
    case Component.MONTH_PICKER:
      return 'MonthPicker';
    case Component.RANGE_PICKER:
      return 'RangePicker';
    case Component.WEEK_PICKER:
      return 'WeekPicker';
    case Component.TIME_PICKER:
      return 'TimePicker';
    case Component.SWITCH:
      return 'Switch';
    case Component.STRENGTH_METER:
      return 'StrengthMeter';
    case Component.UPLOAD:
      return 'Upload';
    case Component.ICON_PICKER:
      return 'IconPicker';
    case Component.RENDER:
      return 'Render';
    case Component.SLIDER:
      return 'Slider';
    case Component.RATE:
      return 'Rate';
    default:
      return 'undefined';
  }
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
    field: 'origin',
    label: 'origin',
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
    field: 'settingType',
    label: '设置类型',
    component: 'RadioButtonGroup',
    defaultValue: SettingType.DIRECTORY,
    componentProps: {
      options: [
        { label: '目录', value: SettingType.DIRECTORY },
        { label: '设置页', value: SettingType.PAGE },
        { label: '设置项', value: SettingType.ITEM },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    required: true,
  },
  {
    field: 'pid',
    label: '上级系统设置',
    component: 'TreeSelect',
    componentProps: {
      replaceFields: {
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
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
  },
  {
    field: 'permissions',
    label: '权限标识',
    component: 'Input',
    helpMessage: '多个用逗号分隔，如：user:list,user:create',
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '启用', value: Status.ENABLE },
        { label: '停用', value: Status.DISABLE },
      ],
    },
  },
  {
    field: 'code',
    label: '设置编码',
    component: 'Input',
    rules: [
      {
        required: false,
        pattern: /[a-zA-Z0-9\-]/,
        message: '用于获取设置的唯一编码标识。仅数字、字母、中横线组成',
        trigger: 'blur',
      },
    ],
    helpMessage: '唯一标识码，仅数字、字母、中横线组成',
    show: ({ values }) => isItem(values.settingType),
  },
  {
    field: 'helpMessage',
    label: '提示消息',
    component: 'InputTextArea',
    show: ({ values }) => isItem(values.settingType),
  },
  {
    field: 'component',
    label: '组件',
    component: 'Select',
    defaultValue: Component.INPUT,
    componentProps: {
      options: [
        { label: '普通文本框（Input）', value: Component.INPUT },
        { label: 'ID文本框（IdInput）', value: Component.ID_INPUT },
        { label: 'InputGroup', value: Component.INPUT_GROUP },
        { label: '密码框（InputPassword）', value: Component.INPUT_PASSWORD },
        { label: 'InputSearch', value: Component.INPUT_SEARCH },
        { label: '文本域（InputTextArea）', value: Component.INPUT_TEXT_AREA },
        { label: '数字框（InputNumber）', value: Component.INPUT_NUMBER },
        { label: 'InputCountDown', value: Component.INPUT_COUNT_DOWN },
        { label: 'ApiSelect', value: Component.API_SELECT },
        { label: '下拉框（Select）', value: Component.SELECT },
        { label: 'TreeSelect', value: Component.TREE_SELECT },
        { label: '单选方形按钮组（RadioButtonGroup）', value: Component.RADIO_BUTTON_GROUP },
        { label: '单选圆形按钮组（RadioGroup）', value: Component.RADIO_GROUP },
        { label: '复选框（Checkbox）', value: Component.CHECKBOX },
        { label: '复选框组（CheckboxGroup）', value: Component.CHECKBOX_GROUP },
        { label: 'AutoComplete', value: Component.AUTO_COMPLETE },
        { label: 'Cascader', value: Component.CASCADER },
        { label: '日期选择器（DatePicker）', value: Component.DATE_PICKER },
        { label: '月份选择器（MonthPicker）', value: Component.MONTH_PICKER },
        { label: '日期范围选择器（RangePicker）', value: Component.RANGE_PICKER },
        { label: '周选择器（WeekPicker）', value: Component.WEEK_PICKER },
        { label: '时间选择器（TimePicker）', value: Component.TIME_PICKER },
        { label: '开关（Switch）', value: Component.SWITCH },
        { label: '密码强度校验组件（StrengthMeter）', value: Component.STRENGTH_METER },
        { label: '文件上传（Upload）', value: Component.UPLOAD },
        { label: 'ICON选择器（IconPicker）', value: Component.ICON_PICKER },
        { label: 'Render', value: Component.RENDER },
        { label: 'Slider', value: Component.SLIDER },
        { label: '评分（Rate）', value: Component.RATE },
      ],
    },
    required: ({ values }) => isItem(values.settingType),
    show: ({ values }) => isItem(values.settingType),
  },
  {
    field: 'val',
    label: '默认值',
    component: 'Input',
    show: ({ values }) => isItem(values.settingType),
  },
  {
    field: 'require',
    label: 'require',
    component: 'Switch',
    show: ({ values }) => isItem(values.settingType),
  },
  {
    field: 'rules',
    label: 'rules',
    component: 'InputTextArea',
    slot: 'RulesSlot',
    helpMessage:
      '[\n' +
      '      {\n' +
      '        required: false,\n' +
      '        pattern: /[a-zA-Z0-9\\-]/,\n' +
      "        message: '仅数字、字母、中横线组成',\n" +
      "        trigger: 'blur',\n" +
      '      },\n' +
      '    ]',
    show: ({ values }) => isItem(values.settingType),
    colProps: { lg: 24 },
  },
  {
    field: 'componentProps',
    label: 'componentProps',
    component: 'InputTextArea',
    slot: 'ComponentPropsSlot',
    helpMessage:
      '{\n' +
      '      options: [\n' +
      "        { label: '停用', value: 0 },\n" +
      "        { label: '启用', value: 1 },\n" +
      '      ],\n' +
      '    }',
    show: ({ values }) => isItem(values.settingType),
    colProps: { lg: 24 },
  },
  {
    field: 'colProps',
    label: 'colProps',
    component: 'InputTextArea',
    slot: 'ColPropsSlot',
    helpMessage:
      '{\n' +
      '      span: 24,\n' +
      '      //<576px\n' +
      '      xs: 24,\n' +
      '      //≥576px\n' +
      '      sm: 24,\n' +
      '      //≥768px\n' +
      '      md: 24,\n' +
      '      //≥992px\n' +
      '      lg: 24,\n' +
      '      //≥1200px\n' +
      '      xl: 24,\n' +
      '      //≥1600px\n' +
      '      xxl: 24,\n' +
      '    }',
    show: ({ values }) => isItem(values.settingType),
    colProps: { lg: 24 },
  },
];

/**
 * 详情
 */
export const descSchema: DescItem[] = [
  {
    field: 'settingType',
    label: '设置类型',
    render: (val) => renderOfSettingType(val),
  },
  {
    field: 'permissions',
    label: '授权',
  },
  {
    field: 'status',
    label: '状态',
    render: (val) => renderOfStatus(val),
  },
  {
    field: 'title',
    label: '标题',
  },
  {
    field: 'helpMessage',
    label: '提示消息',
  },
  {
    field: 'component',
    label: '组件',
    render: (val) => renderOfComponent(val),
  },
  {
    field: 'val',
    label: '默认值',
  },
  {
    field: 'require',
    label: '是否必须',
    render: (val) => (eval(val) ? '是' : '否'),
  },
  {
    field: 'enumVal',
    label: '枚举值',
  },
  {
    field: 'rules',
    label: '自定义校验规则',
  },
  {
    field: 'componentProps',
    label: '组件属性',
  },
  {
    field: 'colProps',
    label: '列属性',
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
