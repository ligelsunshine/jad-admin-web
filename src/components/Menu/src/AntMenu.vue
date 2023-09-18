<template>
  <Menu v-bind="$props">
    <AntMenuItem :items="items" />
  </Menu>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Menu } from 'ant-design-vue';
  import { basicProps } from '/@/components/Menu/src/props';
  import { propTypes } from '/@/utils/propTypes';
  import { ThemeEnum } from '/@/enums/appEnum';

  import AntMenuItem from './components/AntMenuItem.vue';
  export default defineComponent({
    name: 'AntMenu',
    components: { Menu, AntMenuItem },
    props: { ...basicProps, theme: propTypes.string.def(ThemeEnum.LIGHT) },
    emits: [],
    setup() {
      return {};
    },
  });
</script>

<style scoped lang="less"></style>
