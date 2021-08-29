<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增角色 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              tooltip: '编辑',
            },
            {
              icon: 'clarity:menu-line',
              onClick: handleMenu.bind(null, record),
              tooltip: '分配菜单权限',
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              tooltip: '删除',
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
  import RoleDrawer from './RoleDrawer.vue';
  import MenuDrawer from './MenuDrawer.vue';
  import { columns, searchFormSchema } from './role.data';
  import { deleteRole, getRoleListPage } from '/@/api/sys/role';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'RoleManagement',
    components: { MenuDrawer, BasicTable, RoleDrawer, TableAction },
    setup() {
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
        tableSetting: {
          redo: true,
          size: true,
          setting: true,
          fullScreen: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
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

      function handleMenu(record: Recordable) {
        openMenuDrawer(true, {
          record,
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
        handleMenu,
        handleDelete,
        handleSuccess,
      };
    },
  });
</script>
