<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <ModuleTree
      v-auth="'devtools:generator:getModule'"
      class="w-1/4 xl:w-1/5"
      @select="handleSelect"
    />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button v-auth="'devtools:generator:save'" type="primary" @click="handleCreate">
          新增Model
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              tooltip: '编辑',
              auth: 'devtools:generator:update',
            },
            {
              icon: 'clarity:design-line',
              onClick: handleDesign.bind(null, record),
              tooltip: '设计',
              auth: 'devtools:generator:design',
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              tooltip: '删除',
              auth: 'devtools:generator:delete',
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
  import { BasicTable, useTable, TableAction, beforeFetchFun } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useGo } from '/@/hooks/web/usePage';

  import { columns, searchFormSchema } from '/@/views/devtools/generator/generator.data';
  import ModuleTree from '/@/views/devtools/generator/ModuleTree.vue';
  import ModelDrawer from '/@/views/devtools/generator/ModelDrawer.vue';
  import { deleteApi, getPageApi } from '/@/api/devtools/generator';

  export default defineComponent({
    name: 'Index',
    components: { ModelDrawer, PageWrapper, ModuleTree, BasicTable, TableAction },
    setup() {
      const go = useGo();
      const { hasPermission } = usePermission();
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
          ifShow: () =>
            hasPermission('devtools:generator:update') ||
            hasPermission('devtools:generator:design') ||
            hasPermission('devtools:generator:delete'),
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

      async function handleDelete(record: Recordable) {
        await deleteApi(record.id);
        await reload();
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
