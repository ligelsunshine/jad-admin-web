<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="数据源详情" width="50%">
    <Description class="mt-4" size="middle" :column="3" :data="datasource" :schema="descSchema" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description } from '/@/components/Description';
  import { getApi } from '/@/api/sys/datasource/Datasource.api';
  import { descSchema } from '/@/views/sys/datasource/Datasource.data';

  export default defineComponent({
    name: 'DatasourceModal',
    components: { BasicModal, Description },
    setup() {
      const id = ref('');
      const datasource = ref<Datasource>({ id: '' });
      const [registerModal] = useModalInner(async (data) => {
        id.value = data.record.id;
        datasource.value = await getApi(id.value);
      });

      return {
        registerModal,
        datasource,
        descSchema,
      };
    },
  });
</script>
<style scoped></style>
