<template>
  <template v-for="item in items" :key="item.key">
    <MenuItem v-if="!item.children || item.children.length == 0" :key="item.key || item.id">
      <template #icon v-if="item.icon">
        <Icon :icon="item.icon" />
      </template>
      {{ item.name || item.title }}
    </MenuItem>
    <SubMenu v-else :title="item.name || item.title" :key="item.key || item.id">
      <template #icon v-if="item.icon">
        <Icon :icon="item.icon" />
      </template>
      <AntMenuItem :items="item.children" />
    </SubMenu>
  </template>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Menu } from 'ant-design-vue';
  import type { Menu as MenuType } from '/@/router/types';
  import Icon from '/@/components/Icon/src/Icon.vue';

  export default defineComponent({
    name: 'AntMenuItem',
    components: {
      Icon,
      MenuItem: Menu.Item,
      SubMenu: Menu.SubMenu,
    },
    props: {
      items: {
        type: Array as PropType<MenuType[]>,
        default: () => {},
      },
    },
    emits: [],
    setup() {
      return {};
    },
  });
</script>

<style scoped lang="less"></style>
