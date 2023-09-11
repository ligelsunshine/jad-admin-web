<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    width="70%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #RulesSlot="{ model, field }">
        <CodeEditor
          v-model:value="model[field]"
          @change="
            (val) => {
              handleEditorChange({ rules: val });
            }
          "
          :readonly="false"
        />
      </template>
      <template #ComponentPropsSlot="{ model, field }">
        <CodeEditor
          v-model:value="model[field]"
          @change="
            (val) => {
              handleEditorChange({ componentProps: val });
            }
          "
          :readonly="false"
        />
      </template>
      <template #ColPropsSlot="{ model, field }">
        <CodeEditor
          v-model:value="model[field]"
          @change="
            (val) => {
              handleEditorChange({ colProps: val });
            }
          "
          :readonly="false"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { CodeEditor } from '/@/components/CodeEditor';

  import { saveApi, updateApi, getTreeApi } from '/@/api/sys/settings/SettingsMgr.api';
  import { formSchema } from '/@/views/sys/settings-mgr/Settings.data';
  import { validateJson } from '/@/utils/jsonUtil';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'SettingsModal',
    components: { BasicModal, BasicForm, CodeEditor },
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

      async function handleEditorChange(data: {
        rules?: string;
        componentProps?: string;
        colProps?: string;
      }) {
        await setFieldsValue({
          ...data,
        });
      }
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
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if (!validateEditor()) {
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
        handleEditorChange,
        handleSubmit,
      };
    },
  });
</script>
