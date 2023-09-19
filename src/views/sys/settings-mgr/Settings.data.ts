import { FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import { formatToDateTime } from '/@/utils/dateUtil';
import { Status, useDataModel } from '/@/api/data';
import { buttonIcon, folderIcon, menuIcon, MenuType } from '/@/views/sys/menu/menu.data';
import { h } from 'vue';
import { Icon } from '/@/components/Icon';
import { CodeEditor } from '/@/components/CodeEditor';

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
  title: string;
  icon?: string;
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
export function getSettingType(settingType: number): MenuType {
  let model: MenuType = { type: settingType };
  switch (settingType) {
    case SettingType.DIRECTORY:
      model = {
        type: settingType,
        text: '目录',
        icon: folderIcon,
        color: 'orange',
      };
      break;
    case SettingType.PAGE:
      model = {
        type: settingType,
        text: '设置页',
        icon: menuIcon,
        color: 'green',
      };
      break;
    case SettingType.ITEM:
      model = {
        type: settingType,
        text: '设置项',
        icon: buttonIcon,
        color: 'green',
      };
      break;
  }
  return model;
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
    helpMessage:
      '多个用逗号分隔，如：user:list,user:create。不填代表此设置不需要认证和授权即可获取，即公开设置',
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
    label: '自定义规则',
    component: 'InputTextArea',
    slot: 'RulesSlot',
    show: ({ values }) => isItem(values.settingType),
    colProps: { lg: 24 },
  },
  {
    field: 'componentProps',
    label: '组件属性',
    component: 'InputTextArea',
    slot: 'ComponentPropsSlot',
    show: ({ values }) => isItem(values.settingType),
    colProps: { lg: 24 },
  },
  {
    field: 'colProps',
    label: '列属性',
    component: 'InputTextArea',
    slot: 'ColPropsSlot',
    helpMessage:
      'span: 占用的栅格单元数；xs: <576px；sm: ≥576px；md: ≥768px；lg: ≥992px；xl: ≥1200px；xxl: ≥1600px',
    show: ({ values }) => isItem(values.settingType),
    colProps: { lg: 24 },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
    colProps: { lg: 24 },
  },
];

/**
 * 渲染JSON
 *
 * @param val json字符串
 */
function renderOfJsonCode(val: string) {
  if (val) {
    return h(CodeEditor, { value: val, maxHeight: '200px', readonly: true });
  } else {
    return '';
  }
}
/**
 * 详情
 */
export const descSchema: DescItem[] = [
  {
    field: 'settingType',
    label: '设置类型',
    span: 2,
    render: (val) => {
      const settingType = getSettingType(val);
      return h('p', [h(Icon, { icon: settingType?.icon }), ' ' + settingType?.text]);
    },
  },
  {
    field: 'title',
    label: '标题',
    span: 2,
  },
  {
    field: 'orderNo',
    label: '排序',
  },
  {
    field: 'icon',
    label: '图标',
    render: (val) => {
      return h(Icon, {
        icon: val,
      });
    },
  },
  {
    field: 'permissions',
    label: '权限标识',
  },
  {
    field: 'status',
    label: '状态',
    render: (val) => renderOfStatus(val),
  },
  {
    field: 'code',
    label: '设置编码',
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
    span: 2,
  },
  {
    field: 'rules',
    label: '自定义校验规则',
    span: 2,
    render: (val) => renderOfJsonCode(val),
  },
  {
    field: 'componentProps',
    label: '组件属性',
    span: 2,
    render: (val) => renderOfJsonCode(val),
  },
  {
    field: 'colProps',
    label: '列属性',
    span: 2,
    render: (val) => renderOfJsonCode(val),
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
    span: 2,
  },
];
