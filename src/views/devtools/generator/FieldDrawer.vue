<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="100%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #EnumValSlot>
        <Form onBlur class="custom-form">
          <Row v-for="(enumVal, index) in enumVals" :key="'enumVal' + index" style="margin: 3px 0">
            <Col :span="11">
              <Input v-model:value="enumVal.title">
                <template #prefix>
                  <TypographyText type="secondary">Title: </TypographyText>
                </template>
              </Input>
            </Col>
            <Col :span="11">
              <Input v-model:value="enumVal.name">
                <template #prefix>
                  <TypographyText type="secondary">Name: </TypographyText>
                </template>
              </Input>
            </Col>
            <Col :span="2">
              <a-button type="link" @click="delEnumVal(index)">删除</a-button>
            </Col>
          </Row>
          <a-button block class="mt-5" type="dashed" @click="addEnumVal"> 新增 </a-button>
        </Form>
      </template>
      <template #RulesSlot>
        <Form onBlur class="custom-form">
          <Row v-for="(rule, index) in rules" :key="'rule' + index" style="margin: 3px 0">
            <Col :span="6">
              <Select v-model:value="rule.type">
                <SelectOption value="REGEXP">自定义规则</SelectOption>
                <SelectOption value="STRING_LEN">字符串（定长）</SelectOption>
                <SelectOption value="STRING_RANGE">字符串（范围）</SelectOption>
                <SelectOption value="NUMBER">数字</SelectOption>
                <SelectOption value="INTEGER">整数</SelectOption>
                <SelectOption value="FLOAT">小数</SelectOption>
                <SelectOption value="URL">URL链接</SelectOption>
                <SelectOption value="EMAIL">邮箱</SelectOption>
                <SelectOption value="PHONE">手机</SelectOption>
              </Select>
            </Col>
            <Col :span="16" v-if="rule.type === 'STRING_LEN'">
              <label>长度：</label>
              <InputNumber v-model:value="rule.len" :min="0" />
            </Col>
            <Col :span="8" v-if="rule.type === 'STRING_RANGE'">
              <label>最小值：</label>
              <InputNumber v-model:value="rule.min" :min="0" />
            </Col>
            <Col :span="8" v-if="rule.type === 'STRING_RANGE'">
              <label>最大值：</label>
              <InputNumber v-model:value="rule.max" :min="0" />
            </Col>
            <Col :span="8" v-if="rule.type === 'REGEXP'">
              <Input v-model:value="rule.message">
                <template #prefix>
                  <TypographyText type="secondary">错误消息: </TypographyText>
                </template>
              </Input>
            </Col>
            <Col :span="8" v-if="rule.type === 'REGEXP'">
              <Input v-model:value="rule.pattern">
                <template #prefix>
                  <TypographyText type="secondary">正则表达式: </TypographyText>
                </template>
              </Input>
            </Col>
            <Col :span="2">
              <a-button type="link" @click="delRule(index)">删除</a-button>
            </Col>
          </Row>
          <a-button block class="mt-5" type="dashed" @click="addRule"> 新增 </a-button>
        </Form>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { computed, defineComponent, reactive, ref, unref } from 'vue';
  import {
    Row,
    Col,
    Form,
    Input,
    InputNumber,
    Select,
    Typography,
  } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form';
  import { EnumVal, fieldFormSchema, Rule } from '/@/views/devtools/generator/generator.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { saveFieldApi, updateFieldApi } from '/@/api/devtools/generator';
  const SelectOption = Select.Option;
  const TypographyText = Typography.Text;

  export default defineComponent({
    name: 'FieldDrawer',
    components: {
      BasicDrawer,
      BasicForm,
      Row,
      Col,
      Form,
      Input,
      InputNumber,
      Select,
      SelectOption,
      TypographyText,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const message = useMessage().createMessage;
      const isUpdate = ref(true);
      const generatorId = ref('');
      const enumVals: EnumVal[] = reactive([]);
      let rules: Rule[] = reactive([]);

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 120,
        schemas: fieldFormSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        generatorId.value = data?.generatorId;

        // 清空枚举值
        enumVals.splice(0, enumVals.length);
        // 清空自定义校验规则
        rules.splice(0, rules.length);
        if (unref(isUpdate)) {
          await setFieldsValue({
            ...data.record,
          });
          // 添加枚举值
          if (data.record.type == 'ENUM') {
            if (data.record.enumVal?.length > 0) {
              data.record.enumVal.forEach((enumVlue) => {
                enumVals.push(enumVlue);
              });
            }
          }
          // 添加自定义校验规则
          if (data.record.rules?.length > 0) {
            data.record.rules.forEach((rule) => {
              rules.push(rule);
            });
          }
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增字段' : '编辑字段'));

      async function handleSubmit() {
        try {
          const values = await validate();
          if (values.type === 'ENUM') {
            if (enumVals.length == 0) {
              message.error('请添加枚举值');
              return;
            } else if (!validEnumVals()) {
              return;
            }
          }
          values.enumVal = enumVals;
          if (rules.length > 0) {
            if (!validRules()) {
              return;
            }
          }
          values.rules = rules;
          setDrawerProps({ confirmLoading: true });
          // API
          if (unref(isUpdate)) {
            await updateFieldApi(generatorId.value, values);
          } else {
            await saveFieldApi(generatorId.value, values);
          }
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      function validEnumVals() {
        for (let i = 0; i < enumVals.length; i++) {
          const enumVal = enumVals[i];
          if (!enumVal.title || enumVal.title.trim() === '') {
            message.error('枚举值Title是必须的');
            return false;
          }
          if (!enumVal.name || enumVal.name.trim() === '') {
            message.error('枚举值Name是必须的');
            return false;
          }
          if (!enumVal.name.match(/^[a-zA-Z]+\w*$/)) {
            message.error({ content: '枚举值Name仅数字、字母、下划线，且仅字母开头', duration: 5 });
            return false;
          }
        }
        return true;
      }

      function validRules() {
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          if (rule.type === 'REGEXP') {
            if (!rule.message) {
              message.error('自定义规则->错误消息不能为空');
              return false;
            }
            if (!rule.pattern) {
              message.error('自定义规则->正则表达式不能为空');
              return false;
            }
          }
          if (rule.type === 'STRING_LEN' && !rule.len) {
            message.error('字符串（定长）->长度不能为空');
            return false;
          }
          if (rule.type === 'STRING_RANGE') {
            if (!rule.min) {
              message.error('字符串（范围）->最小值不能为空');
              return false;
            }
            if (!rule.max) {
              message.error('字符串（范围）->最大值不能为空');
              return false;
            }
          }
        }
        return true;
      }

      function delEnumVal(index) {
        enumVals.splice(index, 1);
      }
      function addEnumVal() {
        enumVals.push({ title: '', name: '' });
      }
      function delRule(index) {
        rules.splice(index, 1);
      }
      function addRule() {
        rules.push({ type: 'REGEXP' });
      }
      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        enumVals,
        delEnumVal,
        addEnumVal,
        rules,
        delRule,
        addRule,
      };
    },
  });
</script>
<style scoped>
  .custom-form {
    border: 1px solid rgb(238, 238, 238);
    padding: 10px;
  }
</style>
