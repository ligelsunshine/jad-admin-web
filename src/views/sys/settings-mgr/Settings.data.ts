import { FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description';
import { formatToDateTime } from '/@/utils/dateUtil';

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
 * 状态枚举
 */
export enum Status {
  E_N_A_B_L_E = 0,
  D_I_S_A_B_L_E = 1,
}

/**
 * 状态渲染
 *
 * @param status 状态
 */
export function renderOfStatus(status) {
  switch (status) {
    case Status.E_N_A_B_L_E:
      return '启用';
    case Status.D_I_S_A_B_L_E:
      return '停用';
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
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
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
  },
  {
    field: 'code',
    label: '编码',
    component: 'Input',
    rules: [
      {
        required: false,
        pattern: /[a-zA-Z0-9\-]/,
        message: '仅数字、字母、中横线组成',
        trigger: 'blur',
      },
    ],
    helpMessage: '唯一标识码，仅数字、字母、中横线组成',
  },
  {
    field: 'settingType',
    label: '设置类型',
    component: 'Select',
    defaultValue: SettingType.DIRECTORY,
    componentProps: {
      options: [
        { label: '目录', value: SettingType.DIRECTORY },
        { label: '设置页', value: SettingType.PAGE },
        { label: '设置项', value: SettingType.ITEM },
      ],
    },
    required: true,
  },
  {
    field: 'permissions',
    label: '授权',
    component: 'Input',
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: Status.E_N_A_B_L_E },
        { label: '停用', value: Status.D_I_S_A_B_L_E },
      ],
    },
  },
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    required: true,
  },
  {
    field: 'helpMessage',
    label: '提示消息',
    component: 'InputTextArea',
  },
  {
    field: 'component',
    label: '组件',
    component: 'Select',
    defaultValue: Component.INPUT,
    componentProps: {
      options: [
        { label: 'Input', value: Component.INPUT },
        { label: 'IdInput', value: Component.ID_INPUT },
        { label: 'InputGroup', value: Component.INPUT_GROUP },
        { label: 'InputPassword', value: Component.INPUT_PASSWORD },
        { label: 'InputSearch', value: Component.INPUT_SEARCH },
        { label: 'InputTextArea', value: Component.INPUT_TEXT_AREA },
        { label: 'InputNumber', value: Component.INPUT_NUMBER },
        { label: 'InputCountDown', value: Component.INPUT_COUNT_DOWN },
        { label: 'Select', value: Component.SELECT },
        { label: 'ApiSelect', value: Component.API_SELECT },
        { label: 'TreeSelect', value: Component.TREE_SELECT },
        { label: 'RadioButtonGroup', value: Component.RADIO_BUTTON_GROUP },
        { label: 'RadioGroup', value: Component.RADIO_GROUP },
        { label: 'Checkbox', value: Component.CHECKBOX },
        { label: 'CheckboxGroup', value: Component.CHECKBOX_GROUP },
        { label: 'AutoComplete', value: Component.AUTO_COMPLETE },
        { label: 'Cascader', value: Component.CASCADER },
        { label: 'DatePicker', value: Component.DATE_PICKER },
        { label: 'MonthPicker', value: Component.MONTH_PICKER },
        { label: 'RangePicker', value: Component.RANGE_PICKER },
        { label: 'WeekPicker', value: Component.WEEK_PICKER },
        { label: 'TimePicker', value: Component.TIME_PICKER },
        { label: 'Switch', value: Component.SWITCH },
        { label: 'StrengthMeter', value: Component.STRENGTH_METER },
        { label: 'Upload', value: Component.UPLOAD },
        { label: 'IconPicker', value: Component.ICON_PICKER },
        { label: 'Render', value: Component.RENDER },
        { label: 'Slider', value: Component.SLIDER },
        { label: 'Rate', value: Component.RATE },
      ],
    },
    required: true,
  },
  {
    field: 'val',
    label: '默认值',
    component: 'Input',
  },
  {
    field: 'require',
    label: '是否必须',
    component: 'Switch',
  },
  {
    field: 'enumVal',
    label: '枚举值',
    component: 'InputTextArea',
  },
  {
    field: 'rules',
    label: '自定义校验规则',
    component: 'Input',
  },
  {
    field: 'componentProps',
    label: '组件属性',
    component: 'InputTextArea',
  },
  {
    field: 'colProps',
    label: '列属性',
    component: 'InputTextArea',
  },
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    defaultValue: 0,
    helpMessage: '默认排序为升序',
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
