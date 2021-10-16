<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <PopConfirmButton
          color="error"
          title="确认删除？"
          @confirm="handleDeleteArr"
          :loading="deleteArrLoading"
        >
          <Icon icon="ant-design:delete-outlined" />批量删除
        </PopConfirmButton>
        <a-button type="primary" @click="handleCreate">
          <Icon icon="clarity:add-line" />新增
        </a-button>
        <Dropdown :trigger="['click', 'hover']">
          <a-button type="link"> 更多<DownOutlined /> </a-button>
          <template #overlay>
            <Menu>
              <MenuItem key="1" @click="handleOpenExportModal">
                <Icon icon="ant-design:export-outlined" />数据导出
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              tooltip: '编辑',
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
    <ExpExcelModal @register="registerExportModal" @success="handleExport" />
    <DatasourceDrawer @register="registerDrawer" @success="handleSuccess" />
    <DatasourceModal @register="registerModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, beforeFetchFun, TableAction, useTable } from '/@/components/Table';
  import { ExpExcelModal, ExportModalResult, jsonToSheetXlsx } from '/@/components/Excel';
  import { PopConfirmButton } from '/@/components/Button';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { deleteApi, deleteArrApi, getPageApi } from '/@/api/sys/datasource/Datasource.api';
  import { columns, searchFormSchema } from '/@/views/sys/datasource/Datasource.data';
  import DatasourceDrawer from '/@/views/sys/datasource/DatasourceDrawer.vue';
  import DatasourceModal from '/@/views/sys/datasource/DatasourceModal.vue';

  export default defineComponent({
    name: 'Index',
    components: {
      DatasourceModal,
      DatasourceDrawer,
      PopConfirmButton,
      Icon,
      BasicTable,
      TableAction,
      ExpExcelModal,
      Dropdown,
      Menu,
      MenuItem,
      DownOutlined,
    },
    setup() {
      const message = useMessage().createMessage;
      const deleteArrLoading = ref(false);
      const [registerTable, { reload, getSelectRowKeys, setSelectedRowKeys, getDataSource }] =
        useTable({
          title: '数据源列表',
          api: getPageApi,
          beforeFetch: (params) => {
            return beforeFetchFun(params, searchFormSchema);
          },
          rowKey: 'id',
          columns,
          formConfig: {
            labelWidth: 120,
            schemas: searchFormSchema,
            autoSubmitOnEnter: true,
          },
          rowSelection: { type: 'checkbox' },
          clickToRowSelect: false,
          useSearchForm: true,
          showTableSetting: true,
          bordered: true,
          actionColumn: {
            width: 120,
            title: '操作',
            dataIndex: 'action',
            slots: { customRender: 'action' },
          },
        });
      const [registerExportModal, { openModal: openExportModal }] = useModal();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerModal, { openModal }] = useModal();

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      async function handleDelete(record: Recordable) {
        await deleteApi(record.id);
        await reload();
      }

      async function handleDeleteArr() {
        deleteArrLoading.value = true;
        try {
          const keys = getSelectRowKeys();
          if (keys?.length === 0) {
            message.info('请选择要删除的数据');
            return;
          }
          await deleteArrApi(keys);
          await reload();
          // 清空
          setSelectedRowKeys([]);
        } finally {
          deleteArrLoading.value = false;
        }
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleView(record: Recordable) {
        openModal(true, {
          record,
          id: record.id,
        });
      }

      function handleSuccess() {
        reload();
      }

      function handleOpenExportModal() {
        openExportModal();
      }

      function handleExport({ filename, bookType }: ExportModalResult) {
        const data = getDataSource();
        // 默认Object.keys(data[0])作为header
        jsonToSheetXlsx({
          data,
          filename,
          write2excelOpts: {
            bookType,
          },
        });
      }

      return {
        registerTable,
        registerDrawer,
        registerModal,
        deleteArrLoading,
        handleCreate,
        handleDelete,
        handleDeleteArr,
        handleEdit,
        handleView,
        handleSuccess,
        registerExportModal,
        handleOpenExportModal,
        handleExport,
      };
    },
  });
</script>
