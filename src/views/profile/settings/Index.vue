<template>
  <ScrollContainer>
    <div ref="wrapperRef" :class="prefixCls">
      <Tabs tab-position="left" :tabBarStyle="tabBarStyle">
        <template v-for="item in settingList" :key="item.key">
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
  import { Tabs, TabPane, Menu, MenuItem, Card } from 'ant-design-vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { settingList } from './settings.data';
  import BasicSettings from './BasicSettings.vue';
  import SecureSettings from './SecureSettings.vue';

  export default defineComponent({
    name: 'Index',
    components: {
      ScrollContainer,
      Tabs,
      TabPane,
      Menu,
      MenuItem,
      Icon,
      Card,
      BasicSettings,
      SecureSettings,
    },
    setup() {
      return {
        prefixCls: 'account-setting',
        settingList,
        tabBarStyle: {
          width: 'auto',
        },
      };
    },
  });
</script>
<style lang="less">
  .account-setting {
    margin: 12px;
    background-color: @component-background;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-tab-active {
      background-color: @item-active-bg;
    }
  }
</style>
