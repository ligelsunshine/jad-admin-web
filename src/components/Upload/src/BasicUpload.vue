<template>
  <div>
    <a-button-group>
      <a-button type="primary" @click="openUploadModal" preIcon="carbon:cloud-upload">
        {{ t('component.upload.upload') }}
      </a-button>
      <Tooltip placement="bottom" v-if="showPreview && emptyHidePreview">
        <template #title>
          {{ t('component.upload.uploaded') }}
          <template v-if="fileList.length">
            {{ fileList.length }}
          </template>
        </template>
        <a-button @click="openPreviewModal">
          <Icon icon="bi:eye" />
          <template v-if="showPreviewNumber && fileList.length">
            {{ fileList.length }}
          </template>
        </a-button>
      </Tooltip>
    </a-button-group>

    <UploadModal
      v-bind="bindValue"
      :previewFileList="fileList"
      @register="registerUploadModal"
      @change="handleChange"
      @delete="handleDelete"
    />

    <UploadPreviewModal
      :value="fileList"
      @register="registerPreviewModal"
      @delete="handlePreviewDelete"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch, computed } from 'vue';
  import UploadModal from './UploadModal.vue';
  import UploadPreviewModal from './UploadPreviewModal.vue';
  import { Icon } from '/@/components/Icon';
  import { Tooltip } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { uploadContainerProps } from './props';
  import { omit } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { deleteApi, getListByGroupApi } from '/@/api/file-store/oos/FileStore.api';

  export default defineComponent({
    name: 'BasicUpload',
    components: { UploadModal, UploadPreviewModal, Icon, Tooltip },
    props: uploadContainerProps,
    emits: ['change', 'delete', 'update:value'],

    setup(props, { emit, attrs }) {
      const { t } = useI18n();
      // 上传modal
      const [registerUploadModal, { openModal: openUploadModal }] = useModal();

      // 预览modal
      const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();

      const fileList = ref<string[]>([]);
      const groupId = ref<string>();

      const emptyHidePreview = computed(() => {
        const { emptyHidePreview } = props;
        if (!emptyHidePreview) return true;
        return emptyHidePreview ? fileList.value.length > 0 : true;
      });

      const bindValue = computed(() => {
        const value = { ...attrs, ...props };
        return omit(value, 'onChange');
      });

      watch(
        () => props.value,
        async (value) => {
          groupId.value = value;
          if (value && value.length > 0) {
            fileList.value = await getListByGroupApi(value);
          }
        },
        { immediate: true }
      );

      // 上传modal保存操作
      async function handleChange(gid: string) {
        if (gid && gid.length > 0) {
          fileList.value = await getListByGroupApi(gid);
          emit('update:value', gid);
          emit('change', gid);
        }
      }

      async function handleDelete(fileId: string, fileListCount: int) {
        if (fileId && fileId.length > 0) {
          await deleteApi(fileId);
        }
        if (groupId.value && groupId.value?.length > 0) {
          fileList.value = await getListByGroupApi(groupId.value);
        }
        if (fileListCount === 0) {
          groupId.value = '';
        }
        emit('update:value', groupId.value);
        emit('change', groupId.value);
      }

      async function handlePreviewDelete(fileId: string, fileListCount: int) {
        if (fileId && fileId.length > 0) {
          await deleteApi(fileId);
        }
        if (groupId.value && groupId.value?.length > 0) {
          fileList.value = await getListByGroupApi(groupId.value);
        }
        if (fileListCount === 0) {
          groupId.value = '';
        }
        emit('update:value', groupId.value);
        emit('change', groupId.value);
      }

      return {
        registerUploadModal,
        openUploadModal,
        handleChange,
        registerPreviewModal,
        openPreviewModal,
        fileList,
        emptyHidePreview,
        bindValue,
        handleDelete,
        handlePreviewDelete,
        t,
      };
    },
  });
</script>
