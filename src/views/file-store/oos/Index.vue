<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Authority value="sys:fileStore:deleteArr">
          <PopConfirmButton
            color="error"
            title="确认删除？"
            @confirm="handleDeleteArr"
            :loading="deleteArrLoading"
          >
            <Icon icon="ant-design:delete-outlined" />批量删除
          </PopConfirmButton>
        </Authority>
        <BasicUpload
          :maxSize="100"
          :maxNumber="1000"
          @change="handleUploadChange"
          @delete="handleUploadDelete"
          @previewDelete="handleUploadPreviewDelete"
          :api="uploadApi"
        />
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看',
              onClick: handleView.bind(null, record),
              auth: 'sys:fileStore:get',
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              tooltip: '删除',
              auth: 'sys:fileStore:delete',
            },
          ]"
        />
      </template>
    </BasicTable>
    <FileStoreModal @register="registerModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, beforeFetchFun, TableAction, useTable } from '/@/components/Table';
  import Authority from '/@/components/Authority/src/Authority.vue';
  import { PopConfirmButton } from '/@/components/Button';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicUpload } from '/@/components/Upload';

  import { uploadApi } from '/@/api/file-store/Upload.api';
  import { deleteApi, deleteArrApi, getPageApi } from '/@/api/file-store/oos/FileStore.api';
  import { columns, searchFormSchema } from '/@/views/file-store/oos/FileStore.data';
  import FileStoreModal from '/@/views/file-store/oos/FileStoreModal.vue';

  export default defineComponent({
    name: 'Index',
    components: {
      FileStoreModal,
      PopConfirmButton,
      Authority,
      Icon,
      BasicTable,
      TableAction,
      BasicUpload,
    },
    setup() {
      const { hasPermission } = usePermission();
      const message = useMessage().createMessage;
      const deleteArrLoading = ref(false);
      const [registerTable, { reload, getSelectRowKeys, setSelectedRowKeys }] = useTable({
        title: '对象存储列表',
        api: getPageApi,
        beforeFetch: (params) => {
          return beforeFetchFun(params, searchFormSchema);
        },
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        rowSelection: { type: 'checkbox' },
        clickToRowSelect: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          ifShow: () =>
            hasPermission('sys:fileStore:get') ||
            hasPermission('sys:fileStore:update') ||
            hasPermission('sys:fileStore:delete'),
        },
      });
      const [registerModal, { openModal }] = useModal();

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

      function handleView(record: Recordable) {
        openModal(true, {
          record,
          id: record.id,
        });
      }

      function handleUploadChange(fileList) {
        console.log(fileList);
      }

      function handleUploadDelete(record) {
        // TODO 删除文件
        if (record?.status == 'success') {
          console.log('DEL', record);
        }
      }

      function handleUploadPreviewDelete(url: string) {
        console.log(url);
      }

      return {
        registerTable,
        registerModal,
        deleteArrLoading,
        handleDelete,
        handleDeleteArr,
        handleView,
        handleUploadChange,
        handleUploadDelete,
        handleUploadPreviewDelete,
        uploadApi,
      };
    },
  });
</script>
