<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="代码生成"
    defaultFullscreen
    :canFullscreen="false"
    :footer="null"
  >
    <a-card title="后端代码生成配置" :bordered="true" style="box-shadow: 0 2px 5px #e7e6e6ff">
      <template #extra>
        <a-button type="link" class="ml-2" @click="handleFullSelect">全选</a-button>
        <a-button type="link" class="ml-2" @click="handleNoneSelect">全不选</a-button>
        <a-button type="link" class="ml-2" @click="handleReverseSelect">反选</a-button>
      </template>
      <Row>
        <Col :span="14">
          <BasicForm @register="registerForm">
            <template #pathSelect="{ model, field }">
              <LocalPathSelect v-model:value="model[field]" />
            </template>
          </BasicForm>
        </Col>
        <Col :span="2">
          <div
            type="vertical"
            style="margin: 0 auto 0; background-color: #eeeeeeff; width: 1px; height: 100%"
          ></div>
        </Col>
        <Col :span="8">
          <div>
            <h2>操作：</h2>
            <p>
              <span>数据库表：</span>
              <a-button-group>
                <a-button @click="handleViewTable">预览</a-button>
                <a-button type="primary" @click="handleGenerateTable">生成</a-button>
              </a-button-group>
            </p>
            <p>
              <span>后端代码：</span>
              <a-button-group>
                <a-button @click="handleViewBack">预览</a-button>
                <a-button type="primary" @click="handleGenerateBack">生成</a-button>
              </a-button-group>
            </p>
            <p>
              <span>前端代码：</span>
              <a-button-group>
                <a-button>预览</a-button>
                <a-button type="primary">生成</a-button>
              </a-button-group>
            </p>
          </div>
        </Col>
      </Row>
    </a-card>
    <Spin :tip="result.spin.tip" :spinning="result.spin.spinning">
      <div class="m-5 result-success" v-show="result.show">
        <Result :status="result.status" :title="result.title" :sub-title="result.subTitle">
          <template #extra>
            <a-button type="primary" @click="closeModal"> 关闭弹窗 </a-button>
          </template>
          <div class="desc" v-show="result.show && result.listShow">
            <p style="font-size: 16px; text-align: left">Generate result: </p>
            <p v-for="item in result.data" :key="item" style="text-align: left">{{ item }}</p>
          </div>
          <div class="desc" v-show="result.show && result.tabShow">
            <Tabs tab-position="left">
              <TabPane v-for="item in result.data" :key="item.name" :tab="item.name">
                <p style="text-align: left">{{ item.path }}</p>
                <CodeMirrorEditor
                  :value="item.content"
                  :mode="item.mode"
                  :readonly="false"
                  style="text-align: left"
                />
              </TabPane>
            </Tabs>
          </div>
        </Result>
      </div>
    </Spin>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { Card, Col, Result, Row, Spin, TabPane, Tabs } from 'ant-design-vue';
  import CodeMirrorEditor from '/@/components/CodeEditor/src/codemirror/CodeMirror.vue';
  import { generateBackApi, generateTableApi } from '/@/api/devtools/generator';
  import { isArray, isBoolean } from '/@/utils/is';
  import LocalPathSelect from '/@/components/Selector/LocalPathSelect.vue';

  const schemas: FormSchema[] = [
    {
      field: 'entity',
      label: '',
      component: 'Checkbox',
      renderComponentContent: 'Entity',
      defaultValue: true,
      colProps: {
        span: 8,
      },
    },
    {
      field: 'mapper',
      label: '',
      component: 'Checkbox',
      renderComponentContent: 'Mapper',
      defaultValue: true,
      colProps: {
        span: 8,
      },
    },
    {
      field: 'mapperXml',
      label: '',
      component: 'Checkbox',
      renderComponentContent: 'MapperXml',
      defaultValue: true,
      colProps: {
        span: 8,
      },
    },
    {
      field: 'service',
      label: '',
      component: 'Checkbox',
      renderComponentContent: 'Service',
      defaultValue: true,
      colProps: {
        span: 8,
      },
    },
    {
      field: 'serviceImpl',
      label: '',
      component: 'Checkbox',
      renderComponentContent: 'ServiceImpl',
      defaultValue: true,
      colProps: {
        span: 8,
      },
    },
    {
      field: 'controller',
      label: '',
      component: 'Checkbox',
      renderComponentContent: 'Controller',
      defaultValue: true,
      colProps: {
        span: 8,
      },
    },
    {
      field: 'frontPath',
      label: '',
      component: 'Input',
      slot: 'pathSelect',
      colProps: {
        span: 24,
      },
    },
  ];
  export default defineComponent({
    name: 'GenerateModal',
    components: {
      LocalPathSelect,
      BasicModal,
      BasicForm,
      Row,
      Col,
      [Card.name]: Card,
      Result,
      Tabs,
      TabPane,
      Spin,
      CodeMirrorEditor,
    },
    emits: ['success', 'register'],
    setup: function () {
      const result: {
        show: boolean;
        tabShow: boolean;
        listShow: boolean;
        spin: { tip: string; spinning: boolean };
        status: string;
        title: string;
        subTitle: string;
        data: { name: string; path: string; model: string; content: string }[] | string[] | string;
      } = reactive({
        show: false,
        tabShow: false,
        listShow: false,
        spin: { tip: 'loading', spinning: false },
        status: 'success',
        title: '生成成功',
        subTitle: '请前往项目工程中查看',
        data: [],
      });
      // generate id
      const id = ref('');
      const [registerForm, { getFieldsValue, setFieldsValue, resetFields }] = useForm({
        schemas: schemas,
        showActionButtonGroup: false,
      });
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        setModalProps({ confirmLoading: false });
        id.value = data?.id;
        await updateConfig();
      });

      function saveConfig() {
        const config = getFieldsValue();
        if (config) {
          localStorage.setItem('generateConfig', JSON.stringify(config));
        }
      }

      async function updateConfig() {
        const configStr = localStorage.getItem('generateConfig');
        if (configStr) {
          const config = JSON.parse(configStr);
          await setFieldsValue(config);
        }
      }

      async function handleFullSelect() {
        const data = getFieldsValue();
        for (let key in data) {
          if (data.hasOwnProperty(key) && isBoolean(data[key]) && !data[key]) {
            data[key] = true;
          }
        }
        await setFieldsValue({
          ...data,
        });
        saveConfig();
      }

      async function handleNoneSelect() {
        const data = getFieldsValue();
        for (let key in data) {
          if (data.hasOwnProperty(key) && isBoolean(data[key])) {
            data[key] = false;
          }
        }
        await setFieldsValue({
          ...data,
        });
        saveConfig();
      }

      async function handleReverseSelect() {
        const data = getFieldsValue();
        for (let key in data) {
          if (data.hasOwnProperty(key) && isBoolean(data[key])) {
            data[key] = !data[key];
          }
        }
        await setFieldsValue({
          ...data,
        });
        saveConfig();
      }

      function addMode() {
        if (isArray(result.data)) {
          result.data?.forEach((item) => {
            if (item.name && item.name.endsWith('.sql')) {
              item['mode'] = 'text/x-mysql';
            }
            if (item.name && item.name.endsWith('.java')) {
              item['mode'] = 'text/x-java';
            }
            if (item.name && item.name.endsWith('.xml')) {
              item['mode'] = 'application/xml';
            }
          });
        }
      }

      async function handleViewTable() {
        result.spin.spinning = true;
        const data = generateTableApi(id.value, 'VIEW');
        result.data = await data;
        addMode();
        result.show = true;
        result.tabShow = true;
        result.listShow = false;
        result.spin.spinning = false;
        result.spin.tip = '预览加载中';
        result.status = 'success';
        result.title = '生成成功';
        result.subTitle = '当前为预览模式';
        saveConfig();
      }

      async function handleGenerateTable() {
        try {
          result.spin.spinning = true;
          await generateTableApi(id.value, 'CREATE');
          result.data = ['创建成功'];
          result.show = true;
          result.tabShow = false;
          result.listShow = true;
          result.spin.spinning = false;
          result.spin.tip = '数据库表创建中';
          result.status = 'success';
          result.title = '生成成功';
          result.subTitle = '数据库表创建成功';
        } catch (e) {
          result.show = true;
          result.tabShow = false;
          result.listShow = true;
          result.spin.spinning = false;
          result.spin.tip = '数据库表创建中';
          result.status = 'error';
          result.title = '生成失败';
          result.subTitle = '数据库表创建失败';
          result.data = [e.response.data?.data];
        }
        saveConfig();
      }

      async function handleViewBack() {
        result.spin.spinning = true;
        const config = getFieldsValue();
        const data = generateBackApi(id.value, 'VIEW', config);
        result.data = await data;
        addMode();
        result.show = true;
        result.tabShow = true;
        result.listShow = false;
        result.spin.spinning = false;
        result.spin.tip = '预览加载中';
        result.status = 'success';
        result.title = '生成成功';
        result.subTitle = '当前为预览模式';
        saveConfig();
      }

      async function handleGenerateBack() {
        try {
          result.spin.spinning = true;
          const config = getFieldsValue();
          result.data = await generateBackApi(id.value, 'CREATE', config);
          result.show = true;
          result.tabShow = false;
          result.listShow = true;
          result.spin.spinning = false;
          result.spin.tip = '代码生成中';
          result.status = 'success';
          result.title = '生成成功';
          result.subTitle = '代码生成成功，详情请查看项目工程代码';
        } catch (e) {
          result.show = true;
          result.tabShow = false;
          result.listShow = true;
          result.spin.spinning = false;
          result.status = 'error';
          result.title = '生成失败';
          result.subTitle = '代码生成失败';
          result.data = [e.response.data?.data];
        }
        saveConfig();
      }

      return {
        registerModal,
        registerForm,
        handleFullSelect,
        handleNoneSelect,
        handleReverseSelect,
        closeModal,
        result,
        handleViewTable,
        handleGenerateTable,
        handleViewBack,
        handleGenerateBack,
      };
    },
  });
</script>

<style scoped></style>
