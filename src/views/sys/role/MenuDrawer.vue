<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="分配菜单权限"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menuIds="{ model, field }">
        <BasicTree
          ref="menuTreeRef"
          v-model:value="model[field]"
          :treeData="treeData"
          :replaceFields="{ title: 'title', key: 'id' }"
          title="菜单"
          checkable
          search
          helpMessage="最少必须分配一个菜单，否则用户无法登录系统"
          @check="handleCheck"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree';
  import { BasicForm, useForm } from '/@/components/Form';
  import { menuFormSchema } from '/@/views/sys/role/role.data';
  import { getUserMenuTree } from '/@/api/sys/menu';
  import { AssignPermissions, getRoleMenuIds } from '/@/api/sys/role';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const treeData = ref<TreeItem[]>([]);
      const roleId = ref<string>('');
      let menuIds: string[] = [];
      // 分配权限接口
      interface AssignPermissionsParams {
        roleId: string;
        menuIds: string[];
      }

      const menuTreeRef = ref<Nullable<TreeActionType>>(null);
      const [registerForm, { resetFields, setFieldsValue }] = useForm({
        schemas: menuFormSchema,
        showActionButtonGroup: false,
      });
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        roleId.value = data.record.id;

        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          treeData.value = (await getUserMenuTree()) as any as TreeItem[];
        }
        // 获取已分配的菜单权限
        menuIds = await getRoleMenuIds(data.record.id);
        await setFieldsValue({
          ...{ menuIds: menuIds },
        });
      });

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });
          let params: AssignPermissionsParams = {
            roleId: roleId.value,
            menuIds: menuIds,
          };
          if (!menuIds || menuIds.length == 0) {
            message.error('最少必须分配一个菜单');
            return;
          }
          // 分配权限API
          await AssignPermissions(params);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      async function handleCheck(_, e) {
        const keys: string[] = [];
        if (e.checkedNodes.length > 0) {
          // 只需要叶子节点
          e.checkedNodes.forEach((node) => {
            if (node.props.children == null || node.props.children.length == 0) {
              keys.push(node.key);
            }
          });
        }
        menuIds = keys;
      }

      return {
        registerDrawer,
        registerForm,
        menuTreeRef,
        treeData,
        handleSubmit,
        handleCheck,
      };
    },
  });
</script>
