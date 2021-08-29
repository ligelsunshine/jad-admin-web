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
  import { BasicTree, TreeItem } from '/@/components/Tree';
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
      let actionCheck: { halfChecked: string[]; checked: string[] } = {
        halfChecked: [],
        checked: [],
      };
      // 分配权限接口
      interface AssignPermissionsParams {
        roleId: string;
        roleMenus: { menuId: string; halfChecked: boolean }[];
      }

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
        actionCheck = await getRoleMenuIds(data.record.id);
        await setFieldsValue({
          ...{ menuIds: actionCheck.checked },
        });
      });

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });
          const params = processParams();
          console.log(params);
          if (!params) {
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

      function processParams() {
        let params: AssignPermissionsParams = {
          roleId: roleId.value,
          roleMenus: [],
        };
        if (actionCheck.halfChecked.length == 0 && actionCheck.checked.length == 0) {
          return null;
        }
        // 过滤未全选
        actionCheck.halfChecked.forEach((menuId) => {
          params.roleMenus.push({ menuId: menuId, halfChecked: true });
        });
        // 过滤全选
        actionCheck.checked.forEach((menuId) => {
          params.roleMenus.push({ menuId: menuId, halfChecked: false });
        });
        return params;
      }

      // 合并全选中和半选中
      async function handleCheck(checkedKeys, e) {
        actionCheck.checked = checkedKeys;
        actionCheck.halfChecked = e.halfCheckedKeys;
      }

      return {
        registerDrawer,
        registerForm,
        handleSubmit,
        treeData,
        handleCheck,
        expandedKeys: [...actionCheck.halfChecked, ...actionCheck.checked],
      };
    },
  });
</script>
