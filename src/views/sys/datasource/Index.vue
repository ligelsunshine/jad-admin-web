<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Authority value="sys:datasource:deleteArr">
          <PopConfirmButton
            color="error"
            title="确认删除？"
            @confirm="handleDeleteArr"
            :loading="deleteArrLoading"
          >
            <Icon icon="ant-design:delete-outlined" />批量删除
          </PopConfirmButton>
        </Authority>
        <a-button v-auth="'sys:datasource:save'" type="primary" @click="handleCreate">
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
              auth: 'sys:datasource:get',
            },
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              tooltip: '编辑',
              auth: 'sys:datasource:update',
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              tooltip: '删除',
              auth: 'sys:datasource:delete',
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
  import Authority from '/@/components/Authority/src/Authority.vue';
  import { PopConfirmButton } from '/@/components/Button';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Dropdown, Menu } from 'ant-design-vue';
  import { DownOutlined } from '@ant-design/icons-vue';

  import { deleteApi, deleteArrApi, getPageApi } from '/@/api/sys/datasource/Datasource.api';
  import { columns, searchFormSchema } from '/@/views/sys/datasource/Datasource.data';
  import DatasourceDrawer from '/@/views/sys/datasource/DatasourceDrawer.vue';
  import DatasourceModal from '/@/views/sys/datasource/DatasourceModal.vue';

  const MenuItem = Menu.Item;

  export default defineComponent({
    name: 'Index',
    components: {
      Authority,
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
      const { hasPermission } = usePermission();
      const message = useMessage().createMessage;
      const deleteArrLoading = ref(false);
      const [registerTable, { reload, getSelectRowKeys, getSelectRows, setSelectedRowKeys }] =
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
            ifShow: () =>
              hasPermission('sys:datasource:get') ||
              hasPermission('sys:datasource:update') ||
              hasPermission('sys:datasource:delete'),
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
        const data = getSelectRows();
        if (data?.length === 0) {
          message.info('请选择要导出的数据');
          return;
        }
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
