<template>
  <PageWrapper title="系统设置">
    <template #headerContent>
      <Alert type="info" show-icon banner closable message="说明：">
        <template #description>
          <p
            >右击空白处新增<span style="color: red">根节点</span>，右击树节点可操作<span
              style="color: red"
              >树节点</span
            ></p
          >
          <p
            >注意：<span style="color: red"
              >"目录"下只能添加"目录"和"设置页"，"设置页"下只能添加"设置项"，"设置项"下不能再添加子节点</span
            ></p
          >
        </template>
      </Alert>
    </template>
    <Row :gutter="[16, 16]" v-if="treeData">
      <Col
        :span="12"
        style="max-height: calc(100vh - 210px); overflow-y: scroll; overflow-x: hidden !important"
      >
        <Card @contextmenu="handleContext">
          <template #extra>
            <Button type="primary" ghost @click="handleBindingMenu" v-auth="'sys:settings:bindMenu'"
              ><Icon icon="material-symbols:menu-open-rounded" />重新绑定菜单</Button
            >
          </template>
          <BasicTree
            title="系统设置列表"
            ref="treeRef"
            :treeData="treeData"
            :replaceFields="{ key: 'id' }"
            :beforeRightClick="getRightMenuList"
            :renderIcon="handleRenderIcon"
            @select="handleSelect"
            search
            toolbar
          />
        </Card>
      </Col>
      <Col :span="12" v-auth="'sys:settings:get'">
        <Card title="系统设置详情">
          <Spin :spinning="spinning">
            <Empty v-if="!data" />
            <Description
              v-else
              size="middle"
              :data="data"
              :schema="descSchema"
              :bordered="true"
              :column="2"
              :labelStyle="{ width: 'auto' }"
            />
          </Spin>
        </Card>
      </Col>
    </Row>
    <Row :gutter="[16, 16]" v-else>
      <Col>
        <Card>
          <Empty description="请先绑定菜单">
            <Button
              type="primary"
              class="enter-x"
              ghost
              @click="handleBindingMenu"
              v-auth="'sys:settings:bindMenu'"
              ><Icon icon="material-symbols:menu-open-rounded" />绑定菜单</Button
            >
          </Empty>
        </Card>
      </Col>
    </Row>
    <SettingsModal @register="registerModal" @success="handleSuccess" />
    <MenuSelector @register="registerMenuSelector" @success="handleSelectMenuSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, h, ref, unref, VNode } from "vue";
  import { BasicTree, ContextMenuItem, TreeItem, TreeActionType } from '/@/components/Tree';
  import { Description } from '/@/components/Description';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
import { Row, Col, Card, Empty, Spin, Alert, Button, Tag } from "ant-design-vue";

  import {
    bindMenu,
    deleteApi,
    deleteChildrenApi,
    getApi,
    getTreeAsPromiseApi,
  } from '/@/api/sys/settings/SettingsMgr.api';
  import { descSchema, getSettingType } from '/@/views/sys/settings-mgr/Settings.data';
  import SettingsModal from '/@/views/sys/settings-mgr/SettingsModal.vue';
  import MenuSelector from '/@/views/sys/menu/MenuSelector.vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
import { Status } from "/@/api/data";

  export default defineComponent({
    name: 'Index',
    components: {
      Icon,
      SettingsModal,
      MenuSelector,
      BasicTree,
      Description,
      PageWrapper,
      Button,
      Row,
      Col,
      Card,
      Empty,
      Spin,
      Alert,
    },
    setup() {
      const spinning = ref<boolean>(false);
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const treeData = ref<TreeItem[]>();
      const originTreeData = ref<TreeItem>();
      const data = ref<any>();
      const [registerModal, { openModal }] = useModal();
      const [registerMenuSelector, { openModal: openMenuSelector }] = useModal();
      const [createContextMenu] = useContextMenu();
      getTreeData();
      /**
       * 获取树对象
       */
      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }
      /**
       * 获取树形数据
       */
      function getTreeData() {
        const renderStyle = (treeData: any[]) => {
          if (!treeData) {
            return;
          }
          treeData.forEach((data) => {
            var tags: VNode[] = [];
            var newStyle = {};
            if (data.status == Status.DISABLE) {
              tags.push(h(Tag, { color: '#ff9fa0' }, { default: () => '停用' }));
              newStyle['textDecoration'] = 'line-through';
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
        getTreeAsPromiseApi().then((response) => {
          const data = response.data?.data;
          if (data && data.length === 1) {
            originTreeData.value = data[0];
            if (data[0].children) {
              treeData.value = data[0].children;
              renderStyle(treeData.value);
            } else {
              treeData.value = [];
            }
          } else {
            treeData.value = undefined;
          }
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
            auth: 'sys:settings:update',
          },
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            divider: true,
            handler: () => handleDelete(node.eventKey),
            auth: 'sys:settings:delete',
          },
          {
            label: '添加子系统设置',
            icon: 'ant-design:plus-square-filled',
            handler: () => handleCreate(node),
            auth: 'sys:settings:save',
          },
          {
            label: '删除子系统设置',
            icon: 'ant-design:delete-filled',
            handler: () => handleDeleteChildren(node.eventKey),
            auth: 'sys:settings:delete',
          },
        ];
      }
      /**
       * 左击树节点
       * @param key ID
       */
      async function handleSelect(key) {
        spinning.value = true;
        data.value = null;
        if (key.length > 0) {
          data.value = await getApi(key[0]);
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
              label: '添加系统设置',
              icon: 'ant-design:plus-outlined',
              handler: () => {
                data.value = null;
                data.value = originTreeData.value;
                handleCreate(data.value?.id);
              },
              auth: 'sys:settings:save',
            },
          ],
        });
      }
      function handleCreate(id?: string) {
        let record = null;
        if (id) {
          record = data.value;
        }
        openModal(true, {
          record: record,
          isUpdate: false,
        });
      }
      function handleEdit() {
        openModal(true, {
          record: data.value,
          isUpdate: true,
        });
      }
      async function handleDelete(id: string) {
        await deleteApi(id);
        handleSuccess();
        data.value = null;
      }
      async function handleDeleteChildren(id: string) {
        await deleteChildrenApi(id);
        handleSuccess();
      }
      function handleRenderIcon({ settingType }) {
        return getSettingType(settingType).icon;
      }
      function handleSuccess(response?: { isUpdate; record }) {
        getTreeData();
        if (response?.isUpdate) {
          data.value = response?.record;
        }
      }
      function handleBindingMenu() {
        openMenuSelector(true, {
          title: '请选择菜单',
          checkable: false,
        });
      }
      function handleSelectMenuSuccess({ keys }) {
        if (!keys || keys.length != 1 || !keys[0]) {
          useMessage().createMessage.error('请先选择菜单');
          return;
        }
        bindMenu(keys[0]).then(() => {
          getTreeData();
        });
      }
      return {
        registerModal,
        registerMenuSelector,
        spinning,
        treeRef,
        treeData,
        data,
        descSchema,
        getRightMenuList,
        handleSelect,
        handleContext,
        handleRenderIcon,
        handleSuccess,
        handleBindingMenu,
        handleSelectMenuSuccess,
      };
    },
  });
</script>
<style scoped></style>
