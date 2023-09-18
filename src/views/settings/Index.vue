<template>
  <div ref="wrapperRef" :class="prefixCls">
    <Empty v-if="!items || items.length == 0" />
    <Layout v-else hasSider>
      <Sider :theme="theme">
        <AntMenu :items="items" @click="handleMenuClick" />
      </Sider>
      <Layout>
        <Content :theme="theme"><div>Content</div></Content>
      </Layout>
    </Layout>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Layout, Empty } from 'ant-design-vue';

  import { getTreeAsPromiseApi } from '/@/api/sys/settings/SettingsMgr.api';
  import AntMenu from '/@/components/Menu/src/AntMenu.vue';

  export default defineComponent({
    name: 'Index',
    components: {
      AntMenu,
      Layout,
      Sider: Layout.Sider,
      Content: Layout.Content,
      Empty,
    },
    setup() {
      const items = ref<any[]>([]);
      getTreeAsPromiseApi().then((response) => {
        const data = response.data?.data;
        if (data && data.length === 1 && data[0]?.children?.length > 0) {
          // TODO 过滤设置项
          items.value = data[0].children;
        }
      });

      return {
        theme: 'light',
        prefixCls: 'setting',
        items,
        handleMenuClick: ({ key }) => {
          // TODO 生成设置页
          console.log(key);
        },
      };
    },
  });
</script>

<style scoped lang="less">
  .setting {
    margin: 24px;
    background-color: @component-background;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-tab-active {
      background-color: @item-active-bg;
    }
  }
</style>
