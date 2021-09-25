<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <BasicTree
      title="Module"
      toolbar
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      :replaceFields="{ key: 'name', title: 'name' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';

  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { getModuleApi } from '/@/api/devtools/generator';

  export default defineComponent({
    name: 'ModuleTree',
    components: { BasicTree },

    emits: ['select'],
    setup(_, { emit }) {
      const treeData = ref<TreeItem[]>([]);

      async function fetch() {
        treeData.value = (await getModuleApi()) as unknown as TreeItem[];
      }

      function handleSelect(keys: string, e) {
        emit('select', keys[0]);
      }

      onMounted(() => {
        fetch();
      });
      return { treeData, handleSelect };
    },
  });
</script>
