<template>
  <PageWrapper
    class="high-form"
    :title="`设计 ` + generator.title + ` Model`"
    contentBackground
    @back="goBack"
  >
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
      <BasicTable @register="registerTable">
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
      <a-button block class="mt-5" type="dashed" @click="handleAddField"> 新增字段 </a-button>
    </a-card>
  </PageWrapper>
</template>

<script lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { Description } from '/@/components/Description';
  import { useRoute } from 'vue-router';
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { deleteFieldApi, getApi } from '/@/api/devtools/generator';
  import { descriptionSchema, fieldColumns, FieldSchema, Generator } from './generator.data';
  import { Card } from 'ant-design-vue';
  import { useDrawer } from '/@/components/Drawer';
  import FieldDrawer from '/@/views/devtools/generator/FieldDrawer.vue';

  export default defineComponent({
    name: 'ModelDesign',
    components: {
      PageWrapper,
      Description,
      [Card.name]: Card,
      BasicTable,
      TableAction,
      FieldDrawer,
    },
    setup() {
      const route = useRoute();
      const go = useGo();
      // 此处可以得到ID
      const id = ref(route.params?.id);
      const { setTitle, refreshPage } = useTabs();
      const generator: Generator = ref({});
      const fieldSchema: FieldSchema[] = ref([]);
      getApi(id.value).then((res) => {
        const data = res.data?.data;
        generator.value = data;
        fieldSchema.value = data.model.fieldSchema;
        // 设置Tab的标题（不会影响页面标题）
        setTitle('设计 ' + data.title + ' Model');
      });
      const [registerDrawer, { openDrawer: openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        dataSource: fieldSchema,
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
      async function handleDeleteField(record: Recordable) {
        await deleteFieldApi(id.value, record.id);
        await refreshPage();
      }
      function handleSuccess() {
        refreshPage();
      }
      return {
        descriptionSchema,
        generator,
        fieldSchema,
        goBack,
        registerTable,
        handleAddField,
        handleEditField,
        handleDeleteField,
        registerDrawer,
        handleSuccess,
      };
    },
  });
</script>

<style lang="less" scoped></style>
