<template>
  <div style="background-color: white;">
    <Tree
      checkable
      :tree-data="treeData"
      v-model:expandedKeys="expandedKeys"
      v-model:selectedKeys="selectedKeys"
      v-model:checkedKeys="checkedKeys"
      blockNode
      :defaultExpandAll="true"
      @check="handleCheckMenu"
    >
      <template #6><span style="color: #1890ff">sss</span></template>
    </Tree>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
  import { Tree } from 'ant-design-vue';

  let treeData: TreeDataItem[] = [
    {
      title: '1',
      key: '1',
      children: [
        {
          title: '2',
          key: '2',
          disabled: false,
          children: [
            { title: '3', key: '3', disableCheckbox: false },
            { title: '4', key: '4' },
          ],
        },
        {
          title: '5',
          key: '5',
          children: [{ key: '6', slots: { title: '6' } }],
        },
      ],
    },
  ];
  export default defineComponent({
    components: { Tree },
    setup() {
      const expandedKeys = ref<string[]>([]);
      const selectedKeys = ref<string[]>([]);
      const checkedKeys = ref<{ checked: string[] | number[]; halfChecked: string[] | number[] }>(
        []
      );

      watch(checkedKeys, () => {
        console.log('checkedKeys', checkedKeys);
      });

      function handleCheckMenu(checkedKeys, e) {
        const checkedKeysResult = [...checkedKeys, ...e.halfCheckedKeys];
        console.log(checkedKeysResult)
      }

      return {
        treeData,
        expandedKeys,
        selectedKeys,
        checkedKeys,
        handleCheckMenu,
      };
    },
  });
</script>

<style scoped></style>
