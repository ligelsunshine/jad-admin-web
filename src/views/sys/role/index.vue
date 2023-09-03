<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-auth="'sys:role:save'">
          新增角色
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              tooltip: '编辑',
              auth: 'sys:role:update',
            },
            {
              icon: 'ant-design:pushpin-outlined',
              onClick: handleUpdateDefaultRole.bind(null, record),
              tooltip: '设为默认角色',
              auth: 'sys:role:update:defaultRole',
            },
            {
              icon: 'clarity:menu-line',
              onClick: handleMenu.bind(null, record),
              tooltip: '分配菜单权限',
              auth: 'sys:role:assignPermissions',
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              tooltip: '删除',
              auth: 'sys:role:delete',
            },
          ]"
        />
      </template>
    </BasicTable>
    <RoleDrawer @register="registerRoleDrawer" @success="handleSuccess" />
    <MenuDrawer @register="registerMenuDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicTable, useTable, TableAction, beforeFetchFun } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import RoleDrawer from './RoleDrawer.vue';
  import MenuDrawer from './MenuDrawer.vue';
  import { columns, searchFormSchema } from './role.data';
  import { deleteRole, getRoleListPage, updateDefaultRole } from '/@/api/sys/role';

  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'RoleManagement',
    components: { MenuDrawer, BasicTable, RoleDrawer, TableAction },
    setup() {
      const { hasPermission } = usePermission();
      const [registerRoleDrawer, { openDrawer: openRoleDrawer }] = useDrawer();
      const [registerMenuDrawer, { openDrawer: openMenuDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: '角色列表',
        api: getRoleListPage,
        beforeFetch: (params) => {
          return beforeFetchFun(params, searchFormSchema);
        },
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
          ifShow: () =>
            hasPermission('sys:role:update') ||
            hasPermission('sys:role:update:defaultRole') ||
            hasPermission('sys:role:assignPermissions') ||
            hasPermission('sys:role:delete'),
        },
      });

      function handleCreate() {
        openRoleDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openRoleDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleUpdateDefaultRole(record: Recordable) {
        updateDefaultRole(record.id).then(() => {
          reload();
        });
      }

      function handleMenu(record: Recordable) {
        openMenuDrawer(true, {
          roleId: record.id,
        });
      }

      function handleDelete(record: Recordable) {
        deleteRole(record.id).then((res) => {
          createMessage.success(res.data.msg);
          reload();
        });
      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerRoleDrawer,
        registerMenuDrawer,
        handleCreate,
        handleEdit,
        handleUpdateDefaultRole,
        handleMenu,
        handleDelete,
        handleSuccess,
      };
    },
  });
</script>
