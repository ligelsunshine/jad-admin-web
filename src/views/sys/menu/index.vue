<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
        <div class="table-settings-arrow">
          <a @click="collapse">
            <span class="iconify" data-icon="mdi:arrow-collapse-vertical"></span>
          </a>
          <a @click="expand">
            <span class="iconify" data-icon="mdi:arrow-expand-vertical"></span>
          </a>
        </div>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'ic:baseline-add',
              onClick: handleCreate.bind(null, record),
              tooltip: '添加子菜单',
            },
            {
              icon: 'ic:baseline-edit',
              onClick: handleEdit.bind(null, record),
              tooltip: '编辑',
            },
            {
              icon: 'ic:baseline-delete',
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
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import MenuDrawer from './MenuDrawer.vue';
  import { defineComponent, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { deleteMenu, getMenuTree } from '/@/api/sys/menu';
  import { useDrawer } from '/@/components/Drawer';
  import { columns, searchFormSchema } from './menu.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'MenuManagement',
    components: { BasicTable, MenuDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();

      const [registerTable, { reload, expandAll, collapseAll }] = useTable({
        title: '菜单列表',
        api: getMenuTree,
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
        isTreeTable: true,
        pagination: false,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record: Recordable) {
        deleteMenu(record.id).then((res) => {
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
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
        collapse,
        expand,
      };
    },
  });
</script>
<style lang="less">
  .table-settings-arrow a {
    cursor: pointer;
    font-size: 20px;
    color: #1a1a1a;
    display: inline-block;
    margin-right: 10px;
    vertical-align: -0.23em !important;
  }
</style>
