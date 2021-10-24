<template>
  <PageWrapper title="菜单管理">
    <template #headerContent>
      <Alert
        type="warning"
        show-icon
        banner
        closable
        message="操作说明："
        description="右击 '菜单列表' 空白处新增 '根菜单'，右击菜单列表可操作菜单"
      />
    </template>
    <Row :gutter="[16, 16]">
      <Col :span="10">
        <Card @contextmenu="handleContext">
          <BasicTree
            title="菜单列表"
            ref="menuTreeRef"
            :treeData="menuTreeData"
            :replaceFields="{ title: 'title', key: 'id' }"
            :beforeRightClick="getRightMenuList"
            @select="handleSelect"
            :clickRowToExpand="false"
            search
            toolbar
          />
        </Card>
      </Col>
      <Col :span="14">
        <Card title="菜单预览">
          <Spin :spinning="spinning">
            <Empty v-if="!menu" />
            <Description
              v-else
              size="middle"
              :data="menu"
              :schema="descSchema"
              :bordered="false"
              :column="2"
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
  import MenuDrawer from '/@/views/sys/menu/MenuDrawer.vue';
  import { descSchema } from '/@/views/sys/menu/menu.data';

  export default defineComponent({
    name: 'Index',
    components: {
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
       * 右键菜单
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
          },
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            divider: true,
            handler: () => handleDelete(node.eventKey),
          },
          {
            label: '添加子菜单',
            icon: 'ant-design:plus-square-filled',
            handler: () => handleCreate(node),
          },
          {
            label: '删除子菜单',
            icon: 'ant-design:delete-filled',
            handler: () => handleDeleteChildren(node.eventKey),
          },
        ];
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
      /**
       * 点击树
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
      function handleContext(e: MouseEvent) {
        createContextMenu({
          event: e,
          items: [
            {
              label: '添加  菜单',
              icon: 'ant-design:plus-outlined',
              handler: () => handleCreate(),
            },
          ],
        });
      }
      function handleSuccess() {
        getMenuTreeData();
      }
      return {
        registerDrawer,
        menuTreeRef,
        menuTreeData,
        spinning,
        descSchema,
        menu,
        getRightMenuList,
        handleSelect,
        handleContext,
        handleSuccess,
      };
    },
  });
</script>
<style scoped></style>
