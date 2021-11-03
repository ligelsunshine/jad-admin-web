<template>
  <PageWrapper title="部门管理">
    <template #headerContent>
      <Alert type="info" show-icon banner closable message="说明：">
        <template #description>
          右击空白处新增<span style="color: red">根节点</span>，右击树节点可操作<span
            style="color: red"
            >树节点</span
          >
        </template>
      </Alert>
    </template>
    <Row :gutter="[16, 16]">
      <Col
        :span="12"
        style="max-height: calc(100vh - 210px); overflow-y: scroll; overflow-x: hidden !important"
      >
        <Card @contextmenu="handleContext">
          <BasicTree
            title="部门列表"
            ref="treeRef"
            :treeData="treeData"
            :replaceFields="{ title: 'name', key: 'id' }"
            :beforeRightClick="getRightMenuList"
            @select="handleSelect"
            search
            toolbar
          />
        </Card>
      </Col>
      <Col :span="12" v-auth="'sys:dept:get'">
        <Card title="部门详情">
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
    <DeptModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicTree, ContextMenuItem, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { Description } from '/@/components/Description';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { Row, Col, Card, Empty, Spin, Alert } from 'ant-design-vue';

  import { deleteDept, deleteDeptChildren, getDept, getDeptTreeAsPromise } from '/@/api/sys/dept';
  import { descSchema } from '/@/views/sys/dept/dept.data';
  import DeptModal from './DeptModal.vue';

  export default defineComponent({
    name: '1455552881344921682',
    components: {
      DeptModal,
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
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const treeData = ref<TreeItem[]>([]);
      const data = ref<any>();
      const [registerModal, { openModal }] = useModal();
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
        getDeptTreeAsPromise().then((response) => {
          treeData.value = response.data?.data;
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
            auth: 'sys:dept:update',
          },
          {
            label: '删除',
            icon: 'ant-design:delete-outlined',
            divider: true,
            handler: () => handleDelete(node.eventKey),
            auth: 'sys:dept:delete',
          },
          {
            label: '添加子部门',
            icon: 'ant-design:plus-square-filled',
            handler: () => handleCreate(node),
            auth: 'sys:dept:save',
          },
          {
            label: '删除子部门',
            icon: 'ant-design:delete-filled',
            handler: () => handleDeleteChildren(node.eventKey),
            auth: 'sys:dept:delete',
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
          data.value = await getDept(key[0]);
        } else {
          data.value = null;
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
              label: '添加部门/公司',
              icon: 'ant-design:plus-outlined',
              handler: () => handleCreate(),
              auth: 'sys:dept:save',
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
        await deleteDept(id);
        handleSuccess();
        data.value = null;
      }
      async function handleDeleteChildren(id: string) {
        await deleteDeptChildren(id);
        handleSuccess();
      }
      function handleSuccess(response?: { isUpdate; record }) {
        getTreeData();
        if (response?.isUpdate) {
          data.value = response?.record;
        }
      }
      return {
        registerModal,
        spinning,
        treeRef,
        treeData,
        data,
        descSchema,
        getRightMenuList,
        handleSelect,
        handleContext,
        handleSuccess,
      };
    },
  });
</script>
<style scoped></style>
