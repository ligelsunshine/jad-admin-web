<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button v-auth="'sys:user:save'" type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看用户详情',
              onClick: handleView.bind(null, record),
              auth: 'sys:user:get',
              ifShow: () => !hasSuperRoleInCodeList(record.roles.map((role) => role.code)),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑用户资料',
              onClick: handleEdit.bind(null, record),
              auth: 'sys:user:update',
              ifShow: () => !hasSuperRoleInCodeList(record.roles.map((role) => role.code)),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此账号',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              auth: 'sys:user:delete',
              ifShow: () => !hasSuperRoleInCodeList(record.roles.map((role) => role.code)),
            },
          ]"
        />
      </template>
      <template #roles="{ record }">
        <Tag v-for="role in record.roles" color="green" :key="role.id" style="margin: 5px">{{
          role.name
        }}</Tag>
      </template>
      <template #dept="{ record }">
        <div>{{ record.dept?.name }}</div>
      </template>
    </BasicTable>
    <AccountModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { BasicTable, useTable, TableAction, beforeFetchFun } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useGo } from '/@/hooks/web/usePage';
  import { Tag } from 'ant-design-vue';

  import AccountModal from './UserModal.vue';
  import DeptTree from './DeptTree.vue';
  import { deleteUser, getUserListPage } from '/@/api/sys/user';
  import { columns, searchFormSchema } from './user.data';

  export default defineComponent({
    name: 'AccountManagement',
    components: { BasicTable, PageWrapper, DeptTree, AccountModal, TableAction, Tag },
    setup() {
      const go = useGo();
      const { hasPermission } = usePermission();
      const [registerModal, { openModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const [registerTable, { reload }] = useTable({
        title: '用户列表',
        api: getUserListPage,
        beforeFetch: (params) => {
          return beforeFetchFun(params, searchFormSchema);
        },
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          ifShow: () =>
            hasPermission('sys:user:get') ||
            hasPermission('sys:user:update') ||
            hasPermission('sys:user:delete'),
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        await deleteUser(record.id);
        await reload();
      }

      function handleSuccess() {
        reload();
      }

      function handleSelect(deptId = '') {
        searchInfo.deptId = deptId;
        reload();
      }

      function handleView(record: Recordable) {
        go('/sys/user/UserDetail/' + record.id);
      }

      /**
       * 是否拥有超级管理员角色
       */
      function hasSuperRoleInCodeList(allCodeList: string[]): boolean {
        const permissionStore = usePermissionStore();
        const superRole = permissionStore.getSuperRole as string;
        return allCodeList.includes(superRole.replace('ROLE_', ''));
      }

      return {
        registerTable,
        registerModal,
        hasPermission,
        hasSuperRoleInCodeList,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleSelect,
        handleView,
        searchInfo,
      };
    },
  });
</script>
