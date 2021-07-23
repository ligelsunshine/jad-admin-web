<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getMenuTree } from '/@/api/sys/menu';

  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';

  import { columns, searchFormSchema } from './menu.data';

  export default defineComponent({
    name: 'MenuManagement',
    components: { BasicTable, MenuDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();

      const menuList = (() => {
        const result: any[] = [];
        for (let index = 0; index < 3; index++) {
          result.push({
            id: `${index}`,
            icon: ['ion:layers-outline', 'ion:git-compare-outline', 'ion:tv-outline'][index],
            component: 'LAYOUT',
            type: '0',
            title: ['Dashboard', '权限管理', '功能'][index],
            permission: '',
            orderNo: index + 1,
            createTime: '@datetime',
            status: ['0', '0', '1'][index],
            children: (() => {
              const children: any[] = [];
              for (let j = 0; j < 4; j++) {
                children.push({
                  id: `${index}-${j}`,
                  type: '1',
                  title: ['菜单1', '菜单2', '菜单3', '菜单4'][j],
                  icon: 'ion:document',
                  permission: ['menu1:view', 'menu2:add', 'menu3:update', 'menu4:del'][index],
                  component: [
                    '/dashboard/welcome/index',
                    '/dashboard/analysis/index',
                    '/dashboard/workbench/index',
                    '/dashboard/test/index',
                  ][j],
                  orderNo: j + 1,
                  createTime: '@datetime',
                  status: ['0', '1', '0', '1'][index],
                  parentMenu: `${index}`,
                  children: (() => {
                    const children: any[] = [];
                    for (let k = 0; k < 4; k++) {
                      children.push({
                        id: `${index}-${j}-${k}`,
                        type: '2',
                        title: '按钮' + (j + 1) + '-' + (k + 1),
                        icon: '',
                        permission:
                          ['menu1:view', 'menu2:add', 'menu3:update', 'menu4:del'][index] +
                          ':btn' +
                          (k + 1),
                        component: [
                          '/dashboard/welcome/index',
                          '/dashboard/analysis/index',
                          '/dashboard/workbench/index',
                          '/dashboard/test/index',
                        ][j],
                        orderNo: j + 1,
                        createTime: '@datetime',
                        status: ['0', '1', '0', '1'][index],
                        parentMenu: `${index}-${j}`,
                        children: undefined,
                      });
                    }
                    return children;
                  })(),
                });
              }
              return children;
            })(),
          });
        }
        return result;
      })();
      console.log(menuList)
      const [registerTable, { reload, expandAll }] = useTable({
        title: '菜单列表',
        api: () => {
          return menuList;
        },
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        isTreeTable: true,
        pagination: false,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
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

      function handleDelete(record: Recordable) {
        console.log(record);
      }

      function handleSuccess() {
        reload();
      }

      function onFetchSuccess() {
        // 演示默认展开所有表项
        nextTick(expandAll);
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
      };
    },
  });
</script>
