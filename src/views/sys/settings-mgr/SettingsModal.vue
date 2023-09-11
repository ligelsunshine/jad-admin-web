<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    width="80%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #RulesSlot="{ model, field }">
        <Button v-if="!model[field]" @click="handleAddFieldValue('rules')" type="primary" ghost
          >添加自定义规则</Button
        >
        <CodeEditor v-else v-model:value="model[field]" validate max-height="400px" />
      </template>
      <template #ComponentPropsSlot="{ model, field }">
        <Button
          v-if="!model[field]"
          @click="handleAddFieldValue('componentProps')"
          type="primary"
          ghost
          >添加组件属性</Button
        >
        <CodeEditor v-else v-model:value="model[field]" validate max-height="400px" />
      </template>
      <template #ColPropsSlot="{ model, field }">
        <Button v-if="!model[field]" @click="handleAddFieldValue('colProps')" type="primary" ghost
          >添加列属性</Button
        >
        <CodeEditor v-else v-model:value="model[field]" validate max-height="400px" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Button } from '/@/components/Button';
  import { CodeEditor } from '/@/components/CodeEditor';

  import { saveApi, updateApi, getTreeApi } from '/@/api/sys/settings/SettingsMgr.api';
  import { formSchema, SettingType } from '/@/views/sys/settings-mgr/Settings.data';
  import { validateJson } from '/@/utils/jsonUtil';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'SettingsModal',
    components: { BasicModal, BasicForm, Button, CodeEditor },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const message = useMessage().createMessage;

      const [
        registerForm,
        { resetFields, setFieldsValue, getFieldsValue, updateSchema, validate },
      ] = useForm({
        labelWidth: 160,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          await setFieldsValue({
            ...data.record,
          });
        } else {
          // 设置上级菜单id
          data.record = { pid: data.record?.id };
          await setFieldsValue({
            ...data.record,
          });
        }
        const treeData = await getTreeApi();
        await updateSchema({
          field: 'pid',
          componentProps: { treeData },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增系统设置' : '编辑系统设置'));

      function validateEditor() {
        try {
          const form = getFieldsValue();
          const fields = ['rules', 'componentProps', 'colProps'];
          fields.forEach((field) => {
            let result = validateJson(form[field]);
            if (result.error) {
              throw new Error('JSON格式错误, ' + field + ': ' + result.message);
            }
          });
          return true;
        } catch (e) {
          message.error(e.message);
          return false;
        }
      }
      function handleAddFieldValue(field: string) {
        const fieldsValue = {
          rules:
            '[{"required":false,"pattern":"[a-zA-Z0-9\\\\-]","message":"仅数字、字母、中横线组成","trigger":"blur"}]',
          componentProps: '{"options":[{"label":"停用","value":0},{"label":"启用","value":1}]}',
          colProps: '{"span":24,"xs":24,"sm":24,"md":24,"lg":24,"xl":24,"xxl":24}',
        };
        const value = fieldsValue[field];
        switch (field) {
          case 'rules':
            setFieldsValue({ rules: value });
            break;
          case 'componentProps':
            setFieldsValue({ componentProps: value });
            break;
          case 'colProps':
            setFieldsValue({ colProps: value });
            break;
        }
      }
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          const { settingType } = getFieldsValue();
          if (settingType === SettingType.ITEM && !validateEditor()) {
            return;
          }
          // API
          if (unref(isUpdate)) {
            await updateApi(values);
          } else {
            await saveApi(values);
          }
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), record: values });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      return {
        registerModal,
        registerForm,
        getTitle,
        handleAddFieldValue,
        handleSubmit,
      };
    },
  });
</script>
