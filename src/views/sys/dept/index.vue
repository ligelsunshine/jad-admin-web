<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess" @edit-end="handleEditEnd">
      <template #toolbar>
        <a-button v-auth="'sys:dept:save'" type="primary" @click="handleCreate">
          新增部门
        </a-button>
        <div class="table-settings-arrow">
          <div @click="collapse" class="collapse-and-expand">
            <span class="iconify" data-icon="mdi:arrow-collapse-vertical"></span>
          </div>
          <div @click="expand" class="collapse-and-expand">
            <span class="iconify" data-icon="mdi:arrow-expand-vertical"></span>
          </div>
        </div>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'ic:baseline-add',
              onClick: handleCreate.bind(null, record),
              tooltip: '添加子部门',
              auth: 'sys:dept:save',
            },
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              tooltip: '编辑',
              auth: 'sys:dept:update',
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              tooltip: '删除',
              auth: 'sys:dept:delete',
            },
          ]"
          :dropDownActions="[
            {
              label: '删除子部门',
              icon: 'ic:baseline-delete',
              color: 'error',
              popConfirm: {
                title: '是否确认删除？',
                confirm: handleDeleteChildren.bind(null, record),
              },
              auth: 'sys:dept:delete',
            },
          ]"
        />
      </template>
    </BasicTable>
    <DeptModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';
  import DeptModal from './DeptModal.vue';

  import { deleteDept, deleteDeptChildren, getDeptTree, updateDept } from '/@/api/sys/dept';
  import { columns, searchFormSchema } from './dept.data';

  export default defineComponent({
    name: 'DeptManagement',
    components: { BasicTable, DeptModal, TableAction },
    setup() {
      const { hasPermission } = usePermission();
      const { createMessage } = useMessage();
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload, expandAll, collapseAll }] = useTable({
        title: '部门列表',
        api: getDeptTree,
        columns,
        useSearchForm: true,
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
        pagination: false,
        striped: false,
        showTableSetting: true,
        bordered: true,
        isTreeTable: true,
        canResize: false,
        actionColumn: {
          width: 180,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
          ifShow: () =>
            hasPermission('sys:dept:save') ||
            hasPermission('sys:dept:update') ||
            hasPermission('sys:dept:delete'),
        },
      });

      function handleCreate(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      function handleEditEnd({ record }: Recordable) {
        updateDept(record).then((res) => {
          createMessage.success(res.data.msg);
          reload();
        });
      }

      function handleDelete(record: Recordable) {
        deleteDept(record.id).then((res) => {
          createMessage.success(res.data.msg);
          reload();
        });
      }

      function handleDeleteChildren(record: Recordable) {
        deleteDeptChildren(record.id).then((res) => {
          createMessage.success(res.data.msg);
          reload();
        });
      }

      function handleSuccess() {
        reload();
      }

      function onFetchSuccess() {
        // 演示默认展开所有表项
        nextTick(expandAll);
      }

      function collapse() {
        // 折叠所有
        nextTick(collapseAll);
      }

      function expand() {
        // 展开所有
        nextTick(expandAll);
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleEditEnd,
        handleDelete,
        handleDeleteChildren,
        handleSuccess,
        onFetchSuccess,
        collapse,
        expand,
      };
    },
  });
</script>
