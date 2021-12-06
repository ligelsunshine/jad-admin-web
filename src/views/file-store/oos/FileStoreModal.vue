<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="对象存储详情" width="50%">
    <Description class="mt-4" size="middle" :column="1" :data="fileStore" :schema="descSchema" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description } from '/@/components/Description';

  import { getApi } from '/@/api/file-store/oos/FileStore.api';
  import { descSchema, FileStore } from '/@/views/file-store/oos/FileStore.data';

  export default defineComponent({
    name: 'FileStoreModal',
    components: { BasicModal, Description },
    setup() {
      const id = ref('');
      const fileStore = ref<FileStore>({ id: '' });
      const [registerModal] = useModalInner(async (data) => {
        id.value = data.record.id;
        fileStore.value = await getApi(id.value);
      });

      return {
        registerModal,
        fileStore,
        descSchema,
      };
    },
  });
</script>
<style scoped></style>
