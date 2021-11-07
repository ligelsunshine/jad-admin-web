<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="字典数据管理"
    width="60%"
    :footer="null"
  >
    <DictDataIndex :dictId="id" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import DictDataIndex from '/@/views/sys/dict/data/Index.vue';

  export default defineComponent({
    name: 'DictDataDrawer',
    components: { BasicDrawer, DictDataIndex },
    setup() {
      const id = ref('');
      const [registerDrawer] = useDrawerInner(async (data) => {
        id.value = data.record.id;
      });

      return {
        registerDrawer,
        id,
      };
    },
  });
</script>
<style scoped></style>
