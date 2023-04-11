<template>
  <div class="py-8 bg-white flex flex-col justify-center items-center">
    <BasicForm @register="register" />
    <div class="flex justify-center">
      <a-button @click="resetFields"> 重置 </a-button>
      <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';

  import { secureSettingsSchema } from './settings.data';
  import { updatePassword } from '/@/api/sys/user';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'SecureSettings',
    components: { BasicForm },
    setup() {
      const userStore = useUserStore();
      const { createConfirm } = useMessage();
      const [register, { validate, resetFields }] = useForm({
        size: 'large',
        baseColProps: { span: 24 },
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: secureSettingsSchema,
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          await updatePassword(values);
          createConfirm({
            iconType: 'warning',
            title: '温馨提示',
            content: '修改成功，请退出重新登录！',
            onOk: async () => {
              await userStore.logout(true);
            },
          });
        } catch (error) {
          console.error(error);
        }
      }

      return { register, resetFields, handleSubmit };
    },
  });
</script>
<style scoped></style>
