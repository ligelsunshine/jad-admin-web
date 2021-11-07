<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Authority value="sys:dict:deleteArr">
          <PopConfirmButton
            color="error"
            title="确认删除？"
            @confirm="handleDeleteArr"
            :loading="deleteArrLoading"
          >
            <Icon icon="ant-design:delete-outlined" />批量删除
          </PopConfirmButton>
        </Authority>
        <a-button v-auth="'sys:dict:save'" type="primary" @click="handleCreate">
          <Icon icon="clarity:add-line" />新增
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              tooltip: '编辑',
              auth: 'sys:dict:update',
            },
            {
              icon: 'clarity:data-cluster-line',
              onClick: handleDictDataModal.bind(null, record),
              tooltip: '字典数据',
              auth: 'sys:dict:dictDataMgr',
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              tooltip: '删除',
              auth: 'sys:dict:delete',
            },
          ]"
        />
      </template>
    </BasicTable>
    <DictDrawer @register="registerDrawer" @success="handleSuccess" />
    <DictDataDrawer @register="registerDictDataDrawer" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, beforeFetchFun, TableAction, useTable } from '/@/components/Table';
  import Authority from '/@/components/Authority/src/Authority.vue';
  import { PopConfirmButton } from '/@/components/Button';
  import { useDrawer } from '/@/components/Drawer';
  import Icon from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { deleteApi, deleteArrApi, getPageApi } from '/@/api/sys/dict/Dict.api';
  import { columns, searchFormSchema } from '/@/views/sys/dict/Dict.data';
  import DictDrawer from '/@/views/sys/dict/DictDrawer.vue';
  import DictDataDrawer from '/@/views/sys/dict/DictDataDrawer.vue';

  export default defineComponent({
    name: 'Index',
    components: {
      DictDrawer,
      DictDataDrawer,
      Authority,
      PopConfirmButton,
      Icon,
      BasicTable,
      TableAction,
    },
    setup() {
      const message = useMessage().createMessage;
      const deleteArrLoading = ref(false);
      const [registerTable, { reload, getSelectRowKeys, setSelectedRowKeys }] = useTable({
        title: '字典列表',
        api: getPageApi,
        beforeFetch: (params) => {
          return beforeFetchFun(params, searchFormSchema);
        },
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 100,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        rowSelection: { type: 'checkbox' },
        clickToRowSelect: false,
        useSearchForm: true,
        bordered: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerDictDataDrawer, { openDrawer: openDictDataDrawer }] = useDrawer();

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      async function handleDelete(record: Recordable) {
        await deleteApi(record.id);
        await reload();
      }

      async function handleDeleteArr() {
        deleteArrLoading.value = true;
        try {
          const keys = getSelectRowKeys();
          if (keys?.length === 0) {
            message.info('请选择要删除的数据');
            return;
          }
          await deleteArrApi(keys);
          await reload();
          // 清空
          setSelectedRowKeys([]);
        } finally {
          deleteArrLoading.value = false;
        }
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

      function handleDictDataModal(record: Recordable) {
        openDictDataDrawer(true, { record });
      }

      return {
        registerTable,
        registerDrawer,
        registerDictDataDrawer,
        deleteArrLoading,
        handleCreate,
        handleDelete,
        handleDeleteArr,
        handleEdit,
        handleSuccess,
        handleDictDataModal,
      };
    },
  });
</script>
