<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <ModuleTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增Model </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              tooltip: '编辑',
            },
            {
              icon: 'clarity:design-line',
              onClick: handleDesign.bind(null, record),
              tooltip: '设计',
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              tooltip: '删除',
            },
          ]"
        />
      </template>
    </BasicTable>
    <ModelDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction, beforeFetchFun } from '/@/components/Table';
  import { columns, searchFormSchema } from '/@/views/devtools/generator/generator.data';
  import { deleteApi, getPageApi } from '/@/api/devtools/generator';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ModuleTree from '/@/views/devtools/generator/ModuleTree.vue';
  import ModelDrawer from '/@/views/devtools/generator/ModelDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { useGo } from '/@/hooks/web/usePage';

  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'Index',
    components: { ModelDrawer, PageWrapper, ModuleTree, BasicTable, TableAction },
    setup() {
      const go = useGo();
      const [registerDrawer, { openDrawer: openDrawer }] = useDrawer();
      const searchInfo = reactive<Recordable>({});
      const [registerTable, { reload }] = useTable({
        title: 'Model列表',
        api: getPageApi,
        beforeFetch: (params) => {
          return beforeFetchFun(params, searchFormSchema);
        },
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          // fixed: 'right',
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDesign(record: Recordable) {
        go('/devtools/generator/ModelDesign/' + record.id);
      }

      function handleDelete(record: Recordable) {
        deleteApi(record.id).then((res) => {
          createMessage.success(res.data.msg);
          reload();
        });
      }

      function handleSuccess() {
        reload();
      }

      function handleSelect(module = '') {
        searchInfo.module = module;
        reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDesign,
        handleDelete,
        handleSuccess,
        handleSelect,
        searchInfo,
      };
    },
  });
</script>
