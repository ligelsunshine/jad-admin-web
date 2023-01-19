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
          :maxSize="1024"
          :maxNumber="1000"
          @change="handleUploadChange"
          @delete="handleUploadDelete"
          @previewDelete="handleUploadPreviewDelete"
          :api="uploadApi"
          :showPreview="false"
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
              icon: 'ant-design:cloud-download-outlined',
              tooltip: '下载',
              onClick: handleDownload.bind(null, record),
            },
            {
              icon: 'ant-design:share-alt-outlined',
              tooltip: '分享外链',
              onClick: handleShareLink.bind(null, record),
            },
            {
              icon: 'icon-park-outline:preview-open',
              tooltip: '浏览器预览',
              onClick: handleBrowserPreview.bind(null, record),
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
      <template #Preview="{ record }">
        <Image
          :src="handlePreview(record)"
          fallback="data:image/png;base64,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"
        />
      </template>
    </BasicTable>
    <FileStoreModal @register="registerModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicTable, beforeFetchFun, TableAction, useTable } from '/@/components/Table';
  import Authority from '/@/components/Authority/src/Authority.vue';
  import { PopConfirmButton } from '/@/components/Button';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicUpload } from '/@/components/Upload';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { Image } from 'ant-design-vue';

  import { uploadApi } from '/@/api/file-store/Upload.api';
  import { deleteApi, deleteArrApi, getPageApi } from '/@/api/file-store/oos/FileStore.api';
  import { columns, searchFormSchema } from '/@/views/file-store/oos/FileStore.data';
  import FileStoreModal from '/@/views/file-store/oos/FileStoreModal.vue';
  import {
    downloadFileApi,
    getFileDownloadUrlApi,
    getFilePreviewUrlApi,
  } from '/@/api/file-store/Download.api';
  import { openWindow } from '/@/utils';

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
      Image,
    },
    setup() {
      const { hasPermission } = usePermission();
      const { clipboardRef, copiedRef } = useCopyToClipboard();
      const { createMessage } = useMessage();
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
        ellipsis: false,
        actionColumn: {
          width: 200,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          ifShow: () => hasPermission('sys:fileStore:get') || hasPermission('sys:fileStore:delete'),
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

      function handlePreview(record) {
        return getFilePreviewUrlApi(record.id);
      }

      function handleDownload(record: Recordable) {
        downloadFileApi(record.id);
      }

      async function handleShareLink(record: Recordable) {
        clipboardRef.value = await getFileDownloadUrlApi(record.id);
        if (unref(copiedRef)) {
          createMessage.success('复制成功');
        }
      }

      function handleBrowserPreview(record: Recordable) {
        openWindow(getFilePreviewUrlApi(record.id), {
          target: true,
        });
      }

      function handleUploadChange(fileList) {
        reload();
      }

      function handleUploadDelete(record) {
        if (record?.status == 'success') {
        }
      }

      function handleUploadPreviewDelete(url: string) {}

      return {
        registerTable,
        registerModal,
        deleteArrLoading,
        handleDelete,
        handleDeleteArr,
        handleView,
        handlePreview,
        handleDownload,
        handleShareLink,
        handleBrowserPreview,
        handleUploadChange,
        handleUploadDelete,
        handleUploadPreviewDelete,
        uploadApi,
      };
    },
  });
</script>
