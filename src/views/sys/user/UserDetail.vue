<template>
  <PageWrapper :title="`用户` + userInfo.username + `的资料`" contentBackground @back="goBack">
    <template #extra>
      <a-button type="danger"> 禁用账号 </a-button>
      <a-button type="primary"> 修改密码 </a-button>
    </template>
    <template #footer>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="detail" tab="用户资料" />
        <a-tab-pane key="logs" tab="操作日志" />
      </a-tabs>
    </template>
    <div class="pt-4 m-4 desc-wrap">
      <template v-if="currentKey === 'detail'">
        <div class="ant-descriptions-view">
          <table>
            <tbody>
              <tr class="ant-descriptions-row">
                <td class="ant-descriptions-item" colspan="1">
                  <div class="ant-descriptions-item-container">
                    <span class="ant-descriptions-item-content">
                      <Avatar :src="userInfo.avatar" :size="100" style="margin-bottom: 20px" />
                    </span>
                  </div>
                </td>
              </tr>
              <tr class="ant-descriptions-row">
                <td class="ant-descriptions-item" colspan="1">
                  <div class="ant-descriptions-item-container">
                    <span class="ant-descriptions-item-label">部门</span>
                    <span class="ant-descriptions-item-content">
                      {{ userInfo.dept?.name }}
                    </span>
                  </div>
                </td>
                <td class="ant-descriptions-item" colspan="2">
                  <div class="ant-descriptions-item-container">
                    <span class="ant-descriptions-item-label">角色</span>
                    <span class="ant-descriptions-item-content">
                      <Tag color="green" v-for="role in userInfo.roles" :key="role.id">
                        {{ role?.name }}
                      </Tag>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Description
          size="middle"
          :bordered="false"
          :column="3"
          :data="userInfo"
          :schema="userSchema"
        />
      </template>
      <template v-if="currentKey === 'logs'">
        <div></div>
      </template>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { Tabs, Avatar, Tag } from 'ant-design-vue';
  import { Description } from '/@/components/Description';
  import { PageWrapper } from '/@/components/Page';
  import { useRoute } from 'vue-router';
  import { defineComponent, ref } from 'vue';
  import { getUser } from '/@/api/sys/user';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { userSchema } from './user.data';
  import { User } from '/#/store';

  export default defineComponent({
    name: 'UserDetail',
    components: { PageWrapper, ATabs: Tabs, ATabPane: Tabs.TabPane, Description, Avatar, Tag },
    setup() {
      const route = useRoute();
      const go = useGo();
      // 此处可以得到用户ID
      const userId = ref(route.params?.id);
      const currentKey = ref('detail');
      const { setTitle } = useTabs();
      let userInfo: User = ref({});
      getUser(userId.value).then((res) => {
        const data = res.data?.data;
        userInfo.value = data;
        // 设置Tab的标题（不会影响页面标题）
        setTitle('详情：用户' + data.username);
      });

      // 页面左侧点击返回链接时的操作
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/sys/user');
      }
      return { userId, userInfo, userSchema, currentKey, goBack };
    },
  });
</script>

<style></style>
