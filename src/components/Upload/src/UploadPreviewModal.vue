<template>
  <BasicModal
    width="800px"
    :title="t('component.upload.preview')"
    wrapClassName="upload-preview-modal"
    v-bind="$attrs"
    @register="register"
    :showOkBtn="false"
  >
    <FileList :dataSource="fileListRef" :columns="columns" :actionColumn="actionColumn" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, watch, ref } from 'vue';
  //   import { BasicTable, useTable } from '/@/components/Table';
  import FileList from './FileList.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { previewProps } from './props';
  import { PreviewFileItem } from './typing';
  import { downloadByUrl } from '/@/utils/file/download';
  import { createPreviewColumns, createPreviewActionColumn } from './data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getDownloadUrlApi } from '/@/api/file-store/Download.api';
  import { createImgPreview } from '/@/components/Preview';

  export default defineComponent({
    components: { BasicModal, FileList },
    props: previewProps,
    emits: ['register', 'delete'],
    setup(props, { emit }) {
      const [register, { closeModal }] = useModalInner();
      const { t } = useI18n();

      const fileListRef = ref<PreviewFileItem[]>([]);
      watch(
        () => props.value,
        (value) => {
          fileListRef.value = value
            .filter((item) => !!item)
            .map((item) => {
              const url = getDownloadUrlApi(item.id);
              return {
                fileId: item.id,
                groupId: item.groupId,
                url: url,
                name: item.name || '',
                type: item.type || '',
              };
            });
        },
        { immediate: true }
      );

      // 删除
      function handleRemove(record: PreviewFileItem) {
        const index = fileListRef.value.findIndex((item) => item.fileId === record.fileId);
        if (index !== -1) {
          const removed = fileListRef.value.splice(index, 1);
          emit('delete', removed[0].fileId, fileListRef.value.length);
        }
      }

      // 预览
      function handlePreview(record: PreviewFileItem) {
        const { fileId = '' } = record;
        const url = getDownloadUrlApi(fileId);
        createImgPreview({
          imageList: [url],
        });
      }

      // 下载
      function handleDownload(record: PreviewFileItem) {
        const { fileId = '' } = record;
        const url = getDownloadUrlApi(fileId);
        downloadByUrl({ url });
      }

      return {
        t,
        register,
        closeModal,
        fileListRef,
        columns: createPreviewColumns(),
        actionColumn: createPreviewActionColumn({ handleRemove, handleDownload, handlePreview }),
      };
    },
  });
</script>
<style lang="less">
  .upload-preview-modal {
    .ant-upload-list {
      display: none;
    }

    .ant-table-wrapper .ant-spin-nested-loading {
      padding: 0;
    }
  }
</style>
