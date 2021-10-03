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
            <template #pathSelect="{ record }">
              <input
                type="file"
                id="file"
                @change="fileChange"
                webkitdirectory
                mozdirectory
                msdirectory
                odirectory
                directory
                multiple
              />
              <a-input-search
                placeholder="前端代码生成路径"
                enter-button="选择"
                @search="handleSelect"
              />
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
                <a-button type="primary">生成</a-button>
              </a-button-group>
            </p>
            <p>
              <span>后端代码：</span>
              <a-button-group>
                <a-button @click="handleViewBack">预览</a-button>
                <a-button type="primary">生成</a-button>
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
            <a-button @click="handleCloseView"> 关闭预览 </a-button>
            <Tabs tab-position="left" style="margin-top: 30px">
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
          </template>
        </Result>
      </div>
    </Spin>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { Row, Col, Card, Result, Tabs, TabPane, Spin } from 'ant-design-vue';
  import CodeMirrorEditor from '/@/components/CodeEditor/src/codemirror/CodeMirror.vue';
  import { generateBackApi, generateTableApi } from '/@/api/devtools/generator';

  const fields: string[] = [
    'entity',
    'mapper',
    'mapperXml',
    'service',
    'serviceImpl',
    'controller',
  ];
  const schemas: FormSchema[] = [];
  fields.forEach((field) => {
    schemas.push({
      field: field,
      label: '',
      component: 'Checkbox',
      renderComponentContent: field.charAt(0).toUpperCase() + field.substr(1),
      defaultValue: true,
      colProps: {
        span: 8,
      },
    });
  });
  schemas.push({
    field: 'frontPath',
    label: '',
    component: 'Input',
    slot: 'pathSelect',
    colProps: {
      span: 24,
    },
  });
  export default defineComponent({
    name: 'GenerateModal',
    components: {
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
    setup(_, { emit }) {
      const result: {
        show: boolean;
        spin: { tip: string; spinning: boolean; };
        status: string;
        title: string;
        subTitle: string;
        data: { name: string; path: string; model: string; content: string }[];
      } = reactive({
        show: false,
        spin: { tip: 'loading', spinning: false },
        status: 'success',
        title: '生成成功',
        subTitle: '请前往项目工程中查看',
        data: [],
      });
      // generate id
      const id = ref('');
      const [registerForm, { getFieldsValue, setFieldsValue, resetFields, validate }] = useForm({
        schemas: schemas,
        showActionButtonGroup: false,
      });
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        setModalProps({ confirmLoading: false });
        id.value = data?.id;
      });
      async function handleFullSelect() {
        const data = getFieldsValue();
        for (let key in data) {
          if (data.hasOwnProperty(key) && !data[key]) {
            data[key] = true;
          }
        }
        await setFieldsValue({
          ...data,
        });
      }
      async function handleNoneSelect() {
        const data = getFieldsValue();
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            data[key] = false;
          }
        }
        await setFieldsValue({
          ...data,
        });
      }
      async function handleReverseSelect() {
        const data = getFieldsValue();
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            data[key] = !data[key];
          }
        }
        await setFieldsValue({
          ...data,
        });
      }
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          console.log(values);
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      function handleSelect() {
        var file = document.getElementById('file');
        file.click();
      }
      function fileChange() {
        try {
          console.log('change');
          const fu = document.getElementById('file');
          // if (fu == null) return;
          console.log(fu.files[0].path);
        } catch (error) {
          console.debug('choice file err:', error);
        }
      }
      function handleCloseView() {
        result.show = false;
      }
      function addMode() {
        result.data.forEach((item) => {
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
      async function handleViewTable() {
        result.spin.spinning = true;
        const data = generateTableApi(id.value, 'VIEW');
        result.data = await data;
        addMode();
        result.show = true;
        result.spin.spinning = false;
        result.spin.tip = '预览加载中';
        result.subTitle = '当前为预览模式';
      }
      async function handleViewBack() {
        result.spin.spinning = true;
        const config = getFieldsValue();
        const data = generateBackApi(id.value, 'VIEW', config);
        result.data = await data;
        addMode();
        result.show = true;
        result.spin.spinning = false;
        result.spin.tip = '预览加载中';
        result.subTitle = '当前为预览模式';
      }
      return {
        registerModal,
        registerForm,
        handleFullSelect,
        handleNoneSelect,
        handleReverseSelect,
        closeModal,
        handleCloseView,
        handleSubmit,
        handleSelect,
        fileChange,
        result,
        handleViewTable,
        handleViewBack,
      };
    },
  });
</script>

<style scoped></style>
