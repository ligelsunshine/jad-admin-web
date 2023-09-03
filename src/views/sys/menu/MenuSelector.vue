<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" @ok="handleOk">
    <BasicTree
      title="菜单列表"
      ref="menuTreeRef"
      :treeData="treeData"
      :replaceFields="{ title: 'title', key: 'id' }"
      :renderIcon="handleRenderIcon"
      :checkable="checkable"
      :multiple="checkable"
      search
    />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree';
  import { getUserMenuTree } from '/@/api/sys/menu';
  import { getMenuType } from '/@/views/sys/menu/menu.data';

  export default defineComponent({
    name: 'MenuSelector',
    components: { BasicTree, BasicModal },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const menuTreeRef = ref<Nullable<TreeActionType>>(null);
      const spinning = ref<boolean>(true);
      const title = ref<string>('');
      const checkable = ref<boolean>(false);
      const treeData = ref<TreeItem[]>([]);

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ loading: true });
        title.value = data?.title;
        if (data?.checkable) {
          checkable.value = data?.checkable;
        }

        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          treeData.value = (await getUserMenuTree()) as any as TreeItem[];
        }
        // spinning.value=false;
        setModalProps({ loading: false });
      });

      function getTree() {
        const tree = unref(menuTreeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }
      function handleRenderIcon({ type }) {
        return getMenuType(type)?.icon;
      }
      function handleOk() {
        let keys;
        if (checkable.value) {
          keys = getTree().getCheckedKeys();
        } else {
          keys = getTree().getSelectedKeys();
        }
        if (!keys || keys.length == 0) {
          useMessage().createMessage.error('请选择菜单');
        } else {
          closeModal();
          emit('success', { keys });
        }
      }
      return {
        registerModal,
        menuTreeRef,
        spinning,
        title,
        checkable,
        treeData,
        handleRenderIcon,
        handleOk,
      };
    },
  });
</script>
