<template>
  <PageWrapper title="菜单管理">
    <template #headerContent>
      <Alert type="info" show-icon banner closable message="说明：">
        <template #description>
          <ul style="list-style: outside">
            <li>
              右击空白处新增 '
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
            :replaceFields="{ key: 'id' }"
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
    <Modal
      :visible="visible"
      :centered="true"
      :confirmLoading="loading"
      title="请输入"
      @ok="handleOk"
      @cancel="handleCancel"
      style="padding: 10px"
    >
      <Input v-model:value="authButtonForm.modelName">
        <template #addonBefore>
          <div style="width: 80px; text-align: right">菜单名:</div>
        </template>
      </Input>
      <Input v-model:value="authButtonForm.authPrefix">
        <template #addonBefore>
          <div style="width: 80px; text-align: right">权限码前缀:</div>
        </template>
      </Input>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, h, reactive, ref, unref, VNode } from 'vue';
  import {
    BasicTree,
    TreeItem,
    TreeActionType,
    ContextMenuOptions,
  } from '/@/components/Tree/index';
  import { Description } from '/@/components/Description';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Row, Col, Card, Empty, Spin, Alert, Modal, Input, Tag } from 'ant-design-vue';

  import {
    saveAuthButton,
    deleteMenu,
    deleteMenuChildren,
    getMenu,
    getUserMenuTreeAsPromise,
  } from '/@/api/sys/menu';
  import { descSchema, getMenuType } from '/@/views/sys/menu/menu.data';
  import MenuDrawer from '/@/views/sys/menu/MenuDrawer.vue';
  import { useModel } from '/@/api/model';

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
      Modal,
      Input,
    },
    setup() {
      const spinning = ref<boolean>(false);
      const loading = ref<boolean>(false);
      const visible = ref<boolean>(false);
      const authButtonForm = reactive<{ modelName?: string; authPrefix: string; pid: string }>({
        authPrefix: '',
        pid: '',
      });
      const authButtonFormRef = ref();
      const menuTreeRef = ref<Nullable<TreeActionType>>(null);
      const menuTreeData = ref<TreeItem[]>([]);
      const menu = ref<any>();
      const message = useMessage();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [createContextMenu] = useContextMenu();
      const { Status } = useModel();
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
        const renderStyle = (treeData: any[]) => {
          if (!treeData) {
            return;
          }
          treeData.forEach((data) => {
            var tags: VNode[] = [];
            var newStyle = {};
            if (data.status == Status.DISABLE) {
              tags.push(h(Tag, { color: '#ff9fa0' }, '停用'));
              newStyle['textDecoration'] = 'line-through';
            }
            if (data.hideMenu) {
              tags.push(h(Tag, { color: '#7c7c7c' }, '隐藏'));
            }
            if (data.hideChildrenInMenu) {
              tags.push(h(Tag, { color: '#7c7c7c' }, '隐藏子菜单'));
            }
            data.title = h(
              'span',
              {
                style: newStyle,
              },
              h('div', [data.title, '  ', tags])
            );
            renderStyle(data.children);
          });
        };
        getUserMenuTreeAsPromise().then((response) => {
          menuTreeData.value = response.data?.data;
          renderStyle(menuTreeData.value);
        });
      }
      /**
       * 右击树节点
       */
      async function getRightMenuList(node: any): Promise<ContextMenuOptions> {
        // 选中数据
        getTree().setSelectedKeys([node.eventKey]);
        await handleSelect([node.eventKey]);
        return {
          width: 180,
          items: [
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
              divider: true,
              handler: () => handleDeleteChildren(node.eventKey),
              auth: 'sys:menu:delete',
            },
            {
              label: '一键添加权限按钮',
              icon: 'mdi:security',
              handler: () => handleAddAuthButton(node.eventKey),
              auth: 'addAuthButton',
            },
          ],
        };
      }
      /**
       * 左击树节点
       * @param key ID
       */
      async function handleSelect(key) {
        spinning.value = true;
        menu.value = null;
        if (key.length > 0) {
          menu.value = await getMenu(key[0]);
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
        menu.value = null;
      }
      async function handleDeleteChildren(id: string) {
        await deleteMenuChildren(id);
        handleSuccess();
      }
      function handleAddAuthButton(id: string) {
        visible.value = true;
        authButtonForm.pid = id;
      }
      function handleRenderIcon({ type }) {
        return getMenuType(type)?.icon;
      }
      function handleSuccess(response?: { isUpdate; record }) {
        getMenuTreeData();
        if (response?.isUpdate) {
          menu.value = response?.record;
        }
      }
      function handleCancel() {
        visible.value = false;
      }
      async function handleOk() {
        if (!authButtonForm.authPrefix) {
          message.createMessage.error('请输入权限码前缀');
          return;
        }
        if (!authButtonForm.pid) {
          message.createMessage.error('请右键菜单再进行操作');
          return;
        }
        try {
          loading.value = true;
          await saveAuthButton(authButtonForm);
          loading.value = false;
          visible.value = false;
          getMenuTreeData();
        } catch (e) {
          console.error(e);
          loading.value = false;
        }
      }
      return {
        menuTreeRef,
        authButtonFormRef,
        registerDrawer,
        spinning,
        loading,
        visible,
        menuTreeData,
        menu,
        authButtonForm,
        descSchema,
        getRightMenuList,
        handleSelect,
        handleContext,
        handleRenderIcon,
        handleSuccess,
        handleCancel,
        handleOk,
      };
    },
  });
</script>
<style scoped></style>
