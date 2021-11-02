<template>
  <PageWrapper title="菜单管理">
    <template #headerContent>
      <Alert type="info" show-icon banner closable message="说明：" v-auth="'showDesc'">
        <template #description>
          <ul style="list-style: outside">
            <li>
              右击 '菜单列表' 空白处新增 '
              <span style="color: red">根菜单</span>
              '，右击菜单列表可操作菜单
            </li>
            <li>
              <ul>
                <li><Icon :icon="handleRenderIcon({ type: 0 })" /> 目录：下级只能为菜单或按钮</li>
                <li>
                  <Icon :icon="handleRenderIcon({ type: 1 })" />
                  菜单：下级只能为菜单或按钮，通常用于route指向前端页面或作为外链使用
                </li>
                <li>
                  <Icon :icon="handleRenderIcon({ type: 2 })" />
                  按钮：叶子节点，通常用于绑定接口权限、按钮权限、组件权限使用
                </li>
              </ul>
            </li>
          </ul>
        </template>
      </Alert>
    </template>
    <Row :gutter="[16, 16]">
      <Col
        :span="10"
        style="max-height: calc(100vh - 210px); overflow-y: scroll; overflow-x: hidden !important"
      >
        <Card @contextmenu="handleContext">
          <BasicTree
            title="菜单列表"
            ref="menuTreeRef"
            :treeData="menuTreeData"
            :clickRowToExpand="false"
            :replaceFields="{ title: 'title', key: 'id' }"
            :beforeRightClick="getRightMenuList"
            :renderIcon="handleRenderIcon"
            @select="handleSelect"
            search
            toolbar
          />
        </Card>
      </Col>
      <Col :span="14" v-auth="'sys:menu:get'">
        <Card title="菜单详情">
          <Spin :spinning="spinning">
            <Empty v-if="!menu" />
            <Description
              v-else
              size="middle"
              :data="menu"
              :schema="descSchema"
              :bordered="true"
              :column="2"
              :labelStyle="{ width: 'auto' }"
            />
          </Spin>
        </Card>
      </Col>
    </Row>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicTree, ContextMenuItem, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { Description } from '/@/components/Description';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { Row, Col, Card, Empty, Spin, Alert } from 'ant-design-vue';

  import {
    deleteMenu,
    deleteMenuChildren,
    getMenu,
    getUserMenuTreeAsPromise,
  } from '/@/api/sys/menu';
  import { descSchema, getMenuType } from '/@/views/sys/menu/menu.data';
  import MenuDrawer from '/@/views/sys/menu/MenuDrawer.vue';

  export default defineComponent({
    name: '1455552881344921618',
    components: {
      Icon,
      MenuDrawer,
      BasicTree,
      Description,
      PageWrapper,
      Row,
      Col,
      Card,
      Empty,
      Spin,
      Alert,
    },
    setup() {
      const spinning = ref<boolean>(false);
      const menuTreeRef = ref<Nullable<TreeActionType>>(null);
      const menuTreeData = ref<TreeItem[]>([]);
      const menu = ref<any>();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [createContextMenu] = useContextMenu();
      getMenuTreeData();
      /**
       * 获取树对象
       */
      function getTree() {
        const tree = unref(menuTreeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }
      /**
       * 获取菜单数据
       */
      function getMenuTreeData() {
        getUserMenuTreeAsPromise().then((response) => {
          menuTreeData.value = response.data?.data;
        });
      }
      /**
       * 右击树节点
       */
      async function getRightMenuList(node: any): Promise<ContextMenuItem[]> {
        // 选中数据
        getTree().setSelectedKeys([node.eventKey]);
        await handleSelect([node.eventKey]);
        return [
          {
            label: '编辑',
            icon: 'clarity:note-edit-line',
            handler: () => handleEdit(),
            auth: 'sys:menu:update',
          },
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            divider: true,
            handler: () => handleDelete(node.eventKey),
            auth: 'sys:menu:delete',
          },
          {
            label: '添加子菜单',
            icon: 'ant-design:plus-square-filled',
            handler: () => handleCreate(node),
            auth: 'sys:menu:save',
          },
          {
            label: '删除子菜单',
            icon: 'ant-design:delete-filled',
            handler: () => handleDeleteChildren(node.eventKey),
            auth: 'sys:menu:delete',
          },
        ];
      }
      /**
       * 左击树节点
       * @param key ID
       */
      async function handleSelect(key) {
        spinning.value = true;
        if (key.length > 0) {
          menu.value = await getMenu(key[0]);
        } else {
          menu.value = null;
        }
        spinning.value = false;
      }

      /**
       * 右击空白处
       * @param e
       */
      function handleContext(e: MouseEvent) {
        createContextMenu({
          event: e,
          items: [
            {
              label: '添加菜单',
              icon: 'ant-design:plus-outlined',
              handler: () => handleCreate(),
              auth: 'sys:menu:save',
            },
          ],
        });
      }
      function handleCreate(id?: string) {
        let record = null;
        if (id) {
          record = menu.value;
        }
        openDrawer(true, {
          record: record,
          isUpdate: false,
        });
      }
      function handleEdit() {
        openDrawer(true, {
          record: menu.value,
          isUpdate: true,
        });
      }
      async function handleDelete(id: string) {
        await deleteMenu(id);
        handleSuccess();
      }
      async function handleDeleteChildren(id: string) {
        await deleteMenuChildren(id);
        handleSuccess();
      }
      function handleRenderIcon({ type }) {
        return getMenuType(type)?.icon;
      }
      function handleSuccess() {
        getMenuTreeData();
      }
      return {
        registerDrawer,
        spinning,
        menuTreeRef,
        menuTreeData,
        menu,
        descSchema,
        getRightMenuList,
        handleSelect,
        handleContext,
        handleRenderIcon,
        handleSuccess,
      };
    },
  });
</script>
<style scoped></style>
