<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #roleIds="{ model, field }">
        <Select
          v-model:value="model[field]"
          mode="multiple"
          placeholder="请选择"
          :options="roleOptions"
          allowClear
          showArrow
          :show-search="false"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Select } from 'ant-design-vue';
  import { formSchemas } from './user.data';
  import { getDeptTree } from '/@/api/sys/dept';
  import { getRoleList } from '/@/api/sys/role';
  import { saveUser, updateUser } from '/@/api/sys/user';

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm, Select },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const roleOptions = ref<{ value: string; label: string }[]>([]);

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        // 初始化角色列表
        if (unref(roleOptions).length === 0) {
          const roles = (await getRoleList()) as any;
          if (roles.length > 0) {
            roles.forEach((role) => {
              roleOptions.value.push({ value: role.id, label: role.name });
            });
          }
        }

        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          await setFieldsValue({
            ...data.record,
          });
        }

        const treeData = await getDeptTree();
        await updateSchema([
          {
            field: 'deptId',
            componentProps: { treeData },
          },
          {
            field: 'password',
            label: '密码',
            component: 'InputPassword',
            rules: [
              {
                required: !unref(isUpdate),
                pattern: /^[A-Za-z0-9@._]{1,16}$/,
                message: '密码只能由 A-Z a-z 0-9 @ . _ 组成',
                trigger: 'blur',
              },
            ],
          },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if (unref(isUpdate)) {
            await updateUser(values);
          } else {
            await saveUser(values);
          }
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, roleOptions };
    },
  });
</script>
