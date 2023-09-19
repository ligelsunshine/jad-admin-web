<template>
  <div ref="wrapperRef" :class="prefixCls">
    <Empty v-if="!items || items.length == 0" />
    <Layout v-else hasSider>
      <Sider :theme="theme">
        <AntMenu
          :items="items"
          @click="handleMenuClick"
          v-model:openKeys="openKeys"
          v-model:selectedKeys="selectedKeys"
        />
      </Sider>
      <Layout>
        <Content>
          <SettingPage />
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { Empty, Layout } from 'ant-design-vue';
  import type { Menu as MenuType } from '/@/router/types';
  import AntMenu from '/@/components/Menu/src/AntMenu.vue';

  import SettingPage from '/@/views/settings/SettingPage.vue';
  import { getTreeAsPromiseApi } from '/@/api/sys/settings/SettingsMgr.api';
  import { Settings, SettingType } from '/@/views/sys/settings-mgr/Settings.data';
  import { Status } from '/@/api/data';

  export default defineComponent({
    name: 'Index',
    components: {
      AntMenu,
      Layout,
      Sider: Layout.Sider,
      Content: Layout.Content,
      Empty,
      SettingPage,
    },
    setup() {
      const items = ref<MenuType[]>([]);
      const openKeys = ref<any[]>([]); // 展开菜单
      const selectedKeys = ref<any[]>([]); // 选中菜单
      const selectedPage = ref<Settings>(); // 选中的数据，即设置页节点
      const pageMap = new Map<string, Settings>([]); // 设置页面, key: id, value: Settings

      // 获取设置
      getTreeAsPromiseApi().then((response) => {
        const data = response.data?.data;
        if (data && data.length === 1 && data[0]?.children?.length > 0) {
          // 过滤设置项
          items.value = filterSettings(data[0].children);
        }
      });

      /**
       * 过滤设置项
       *
       * @param settings
       */
      function filterSettings(settings: Settings[]): MenuType[] {
        const menuItems: MenuType[] = [];
        settings.forEach((setting) => {
          // 默认展开第一个设置页
          if (selectedKeys.value.length == 0) {
            if (setting.settingType == SettingType.PAGE) {
              selectedKeys.value.push(setting.id);
              selectedPage.value = setting;
            } else {
              openKeys.value.push(setting.id);
            }
          }
          // 存放设置页
          if (setting.settingType == SettingType.PAGE) {
            pageMap.set(setting.id, setting);
          }
          // 递归
          if (
            setting.settingType == SettingType.DIRECTORY ||
            setting.settingType == SettingType.PAGE
          ) {
            let children;
            if (setting.children && setting.children.length > 0) {
              children = filterSettings(setting.children);
            }
            menuItems.push({
              id: setting.id,
              name: setting.title,
              title: setting.title,
              icon: setting.icon,
              path: setting.id,
              key: setting.id,
              disabled: setting.status == Status.DISABLE,
              children: children,
              orderNo: setting.orderNo,
              hideMenu: setting.status == Status.DISABLE,
            });
          }
        });
        return menuItems;
      }

      /**
       * 监控 selectedPage
       */
      watch(
        () => selectedPage.value,
        () => {
          renderSettingPage();
        }
      );

      /**
       * 渲染设置页面
       */
      function renderSettingPage() {
        console.log('Select', selectedPage.value?.title);
      }

      /**
       * 点击事件
       *
       * @param key
       */
      function handleMenuClick({ key }) {
        selectedPage.value = pageMap.get(key);
      }
      return {
        theme: 'light',
        prefixCls: 'setting',
        items,
        openKeys,
        selectedKeys,
        handleMenuClick,
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
