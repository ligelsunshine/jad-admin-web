<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-auth="'sys:dictData:save'" color="success" type="primary" @click="handleCreate">
          <Icon icon="clarity:add-line" />添加
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              tooltip: '编辑',
              auth: 'sys:dictData:update',
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              tooltip: '删除',
              auth: 'sys:dictData:delete',
            },
          ]"
        />
      </template>
    </BasicTable>
    <DictDataDrawer @register="registerDrawer" @success="handleSuccess" :dictId="dictId" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, beforeFetchFun, TableAction, useTable } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import Icon from '/@/components/Icon';

  import { deleteApi, getPageApi } from '/@/api/sys/dict/DictData.api';
  import { columns, searchFormSchema } from '/@/views/sys/dict/data/DictData.data';
  import DictDataDrawer from '/@/views/sys/dict/data/DictDataDrawer.vue';

  export default defineComponent({
    name: 'DictDataIndex',
    components: {
      DictDataDrawer,
      Icon,
      BasicTable,
      TableAction,
    },
    props: {
      dictId: {
        type: String,
      },
    },
    setup(props) {
      const [registerTable, { reload }] = useTable({
        api: getPageApi,
        beforeFetch: (params) => {
          params.dictId = props.dictId;
          return beforeFetchFun(params, searchFormSchema);
        },
        rowKey: 'id',
        columns,
        clickToRowSelect: false,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });
      const [registerDrawer, { openDrawer }] = useDrawer();

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      async function handleDelete(record: Recordable) {
        await deleteApi(record.id);
        await reload();
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleDelete,
        handleEdit,
        handleSuccess,
      };
    },
  });
</script>
