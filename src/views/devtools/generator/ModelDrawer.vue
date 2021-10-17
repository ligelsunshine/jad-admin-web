<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { getModuleApi, saveApi, updateApi } from '/@/api/devtools/generator';
  import { formSchema } from './generator.data';

  export default defineComponent({
    name: 'ModelDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      const [
        registerForm,
        { resetFields, setFieldsValue, getFieldsValue, updateSchema, validate },
      ] = useForm({
        labelWidth: 120,
        schemas: formSchema,
        showActionButtonGroup: false,
      });
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          await setFieldsValue({
            ...data.record,
          });
        } else {
          updateModel();
        }
        const treeData = await getModuleApi();
        await updateSchema([
          {
            field: 'module',
            componentProps: { treeData },
          },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增Model' : '编辑Model'));

      function updateModel() {
        const modelStr = localStorage.getItem('model');
        if (modelStr) {
          const model = JSON.parse(modelStr);
          setFieldsValue({
            ...{
              ds: model.ds,
              namespace: model.namespace,
              module: model.module,
            },
          });
        }
      }

      function saveModel() {
        const value = getFieldsValue();
        const model = {
          ds: value.ds,
          namespace: value.namespace,
          module: value.module,
        };
        localStorage.setItem('model', JSON.stringify(model));
      }

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          if (unref(isUpdate)) {
            await updateApi(values);
          } else {
            await saveApi(values);
          }
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
        saveModel();
      }

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
      };
    },
  });
</script>
