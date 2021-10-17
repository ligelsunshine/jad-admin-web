<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="选择数据源"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, beforeFetchFun, useTable } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { getPageApi } from '/@/api/sys/datasource/Datasource.api';
  import { columns, searchFormSchema } from '/@/views/sys/datasource/Datasource.data';

  export default defineComponent({
    name: 'DatasourceSelector',
    components: {
      BasicModal,
      BasicTable,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      let message = useMessage().createMessage;
      const [registerTable, { reload, getSelectRows }] = useTable({
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
        rowSelection: { type: 'radio' },
        clickToRowSelect: true,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
      });
      const [registerModal, { setModalProps, closeModal }] = useModalInner();

      function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });
          let data: any[] = getSelectRows();
          if (data.length == 0) {
            message.warning('请选择数据');
            return;
          }
          closeModal();
          emit('success', data[0]);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerModal,
        handleSubmit,
        handleSuccess,
      };
    },
  });
</script>
