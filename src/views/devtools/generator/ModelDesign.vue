<template>
  <PageWrapper
    class="high-form"
    :title="`设计 ` + generator.title + ` Model`"
    contentBackground
    @back="goBack"
  >
    <template #extra>
      <a-button shape="round" size="large" @click="handleGenerateModal">
        <Icon icon="cib:visual-studio-code" :size="20" />
        Generator
      </a-button>
    </template>
    <a-card title="Model" :bordered="false">
      <Description
        size="middle"
        :bordered="false"
        :column="3"
        :data="generator"
        :schema="descriptionSchema"
      />
    </a-card>
    <a-card title="Field Schema" :bordered="false">
      <BasicTable @register="registerTable" @edit-end="handleEditFieldEnd">
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEditField.bind(null, record),
                tooltip: '编辑',
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  confirm: handleDeleteField.bind(null, record),
                },
                tooltip: '删除',
              },
            ]"
          />
        </template>
      </BasicTable>
      <FieldDrawer @register="registerDrawer" @success="handleSuccess" />
      <GenerateModal @register="registerModal" />
      <a-button block class="mt-5" type="dashed" @click="handleAddField"> 新增字段 </a-button>
    </a-card>
  </PageWrapper>
</template>

<script lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { Description } from '/@/components/Description';
  import { Icon } from '/@/components/Icon/index';
  import { useRoute } from 'vue-router';
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { deleteFieldApi, getApi, getFieldsApi, updateFieldApi } from '/@/api/devtools/generator';
  import { descriptionSchema, fieldColumns, Generator } from './generator.data';
  import { Card } from 'ant-design-vue';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import FieldDrawer from '/@/views/devtools/generator/FieldDrawer.vue';
  import GenerateModal from '/@/views/devtools/generator/GenerateModal.vue';

  export default defineComponent({
    name: 'ModelDesign',
    components: {
      PageWrapper,
      Description,
      [Card.name]: Card,
      BasicTable,
      TableAction,
      Icon,
      FieldDrawer,
      GenerateModal,
    },
    setup() {
      const route = useRoute();
      const go = useGo();
      const { setTitle } = useTabs();
      // 此处可以得到ID
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        api: getFieldsApi,
        beforeFetch: () => {
          return id.value;
        },
        columns: fieldColumns,
        bordered: true,
        canResize: false,
        pagination: false,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      });
      const id = ref(route.params?.id);
      const generator: Generator = ref({});

      getApi(id.value).then((res) => {
        const data = res.data?.data;
        generator.value = data;
        // 设置Tab的标题（不会影响页面标题）
        setTitle('设计 ' + data.title + ' Model');
      });

      // 页面左侧点击返回链接时的操作
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/devtools/generator');
      }

      function handleAddField() {
        openDrawer(true, {
          isUpdate: false,
          generatorId: id,
        });
      }
      function handleEditField(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
          generatorId: id,
        });
      }
      function handleEditFieldEnd({ record }: Recordable) {
        updateFieldApi(id.value, record);
      }
      async function handleDeleteField(record: Recordable) {
        await deleteFieldApi(id.value, record.id);
        await reload();
      }
      function handleSuccess() {
        reload();
      }
      function handleGenerateModal() {
        openModal(true, {
          id: generator.value.id,
        });
      }
      return {
        descriptionSchema,
        generator,
        registerTable,
        registerModal,
        registerDrawer,
        goBack,
        handleAddField,
        handleEditField,
        handleEditFieldEnd,
        handleDeleteField,
        handleSuccess,
        handleGenerateModal,
      };
    },
  });
</script>

<style lang="less" scoped></style>
