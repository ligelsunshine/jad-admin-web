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
  import { AssignPermissions, getRoleMenuItems } from '/@/api/sys/role';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      // 分配权限接口
      interface MenuItem {
        menuId: string;
        leaf: boolean;
      }
      interface AssignPermissionsParams {
        roleId: string;
        menuItems: MenuItem[];
      }
      const treeData = ref<TreeItem[]>([]);
      const roleId = ref<string>('');
      const menuItems = ref<MenuItem[]>([]);

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
        menuItems.value = await getRoleMenuItems(data.record.id);
        const menuIds: string[] = [];
        menuItems.value.forEach((menuItem) => {
          if (menuItem.leaf) {
            menuIds.push(menuItem.menuId);
          }
        });
        await setFieldsValue({
          ...{ menuIds: menuIds },
        });
      });

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });
          if (menuItems.value.length == 0) {
            message.error('最少必须分配一个菜单');
            return;
          }
          let params: AssignPermissionsParams = {
            roleId: roleId.value,
            menuItems: menuItems.value,
          };
          // 分配权限API
          await AssignPermissions(params);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      async function handleCheck(_, e) {
        menuItems.value = [];
        if (e.checkedNodes.length > 0) {
          e.checkedNodes.forEach((node) => {
            const menuItem: MenuItem = { menuId: '', leaf: false };
            // 是否叶子节点
            menuItem.leaf = node.props.children == null || node.props.children.length == 0;
            menuItem.menuId = node.key;
            menuItems.value.push(menuItem);
          });
        }
        if (e.halfCheckedKeys.length > 0) {
          e.halfCheckedKeys.forEach((key) => {
            const menuItem: MenuItem = { menuId: '', leaf: false };
            // 非叶子节点
            menuItem.leaf = false;
            menuItem.menuId = key;
            menuItems.value.push(menuItem);
          });
        }
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
