<template>
  <ScrollContainer>
    <div ref="wrapperRef" :class="prefixCls">
      <Tabs tab-position="left" :tabBarStyle="tabBarStyle">
        <template v-for="item in getSettingList()" :key="item.key">
          <TabPane>
            <template #tab>
              <Icon :icon="item.icon" />
              {{ item.name }}
            </template>
            <Card :title="item.name" :bordered="false">
              <component :is="item.component" />
            </Card>
          </TabPane>
        </template>
      </Tabs>
    </div>
  </ScrollContainer>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { ScrollContainer } from '/@/components/Container';
  import { Tabs, Menu, Card } from 'ant-design-vue';
  import Icon from '/@/components/Icon/src/Icon.vue';

  import { settingList } from './settings.data';
  import BasicSettings from './BasicSettings.vue';
  import SecureSettings from './SecureSettings.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    name: 'Index',
    components: {
      ScrollContainer,
      Tabs,
      TabPane: Tabs.TabPane,
      Menu,
      MenuItem: Menu.Item,
      Icon,
      Card,
      BasicSettings,
      SecureSettings,
    },
    setup() {
      const { hasPermission } = usePermission();
      function getSettingList() {
        // 返回拥有权限的设置列表
        return settingList.filter((setting) => hasPermission(setting.auth));
      }
      return {
        prefixCls: 'account-setting',
        getSettingList,
        tabBarStyle: {
          width: 'auto',
        },
        hasPermission,
      };
    },
  });
</script>
<style lang="less">
  .account-setting {
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
