<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="路径选择"
    width="60%"
    okText="选择此文件夹"
    :canFullscreen="false"
    @ok="handleSubmit"
  >
    <Spin :spinning="spinning">
      <Row style="height: 45vh">
        <Col :span="6">
          <div class="dialog-left" :class="theme">
            <div class="dialog-left-title">快捷方式</div>
            <Divider />
            <ul class="dialog-left-content">
              <li v-for="item in pathData.shortcuts" :key="item.path">
                <a-button type="link" block @click="handlePathIn(item.path)">{{
                  item.name
                }}</a-button>
              </li>
            </ul>
          </div>
        </Col>
        <Col :span="18">
          <div class="dialog-right" :class="theme">
            <div class="dialog-right-content">
              <Row>
                <Col>
                  <a-input-group compact>
                    <a-button @click="handlePathParent(pathData.addrPath)">
                      <Icon icon="icon-park-outline:back" />上一级
                    </a-button>
                    <a-input
                      style="width: calc(100% - 110px); float: right"
                      v-model:value="pathData.addrPath"
                      @pressEnter="handlePathIn(pathData.addrPath)"
                      :readonly="readonly"
                      allowClear
                    />
                  </a-input-group>
                </Col>
              </Row>
              <Divider />
              <div class="dialog-right-content-ul">
                <p v-for="item in pathData.paths" :key="item.path">
                  <a @click="handlePathIn(item.path)">{{ item.name }}</a>
                </p>
                <Empty v-if="pathData.paths?.length === 0" description="此文件夹为空" />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Spin>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { ThemeEnum } from '/@/enums/appEnum';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Row, Col, Spin, Empty, Divider } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon/index';
  import { getLocalPathApi, getParentPathApi, isDirectoryApi } from '/@/api/devtools/generator';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'Selector',
    components: { Icon, BasicModal, Row, Col, Spin, Empty, Divider },
    emits: ['success', 'register'],
    setup: function (_, { emit }) {
      interface Path {
        name: string;
        path: string;
      }
      const { getDarkMode } = useRootSetting();
      const theme = ref('');
      const message = useMessage().createMessage;
      const spinning = ref(false);
      const readonly = ref(false);
      const pathData = reactive<{
        addrPath: string;
        shortcuts: Path[];
        paths: Path[];
      }>({ addrPath: '', paths: [], shortcuts: [] });
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        if (getDarkMode.value === ThemeEnum.DARK) {
          theme.value = 'dark-theme';
        } else {
          theme.value = 'light-theme';
        }
        readonly.value = data?.readonly;
        await handlePathIn(data?.value);
      });
      async function handlePathIn(path: string) {
        try {
          spinning.value = true;
          pathData.shortcuts = await getLocalPathApi({ path: '' });
          if (path) {
            const isDirectory = await isDirectoryApi({ path: path });
            if (isDirectory) {
              pathData.addrPath = path;
              pathData.paths = await getLocalPathApi({ path: path });
            } else {
              pathData.addrPath = pathData.shortcuts[pathData.shortcuts.length - 1].path;
              pathData.paths = await getLocalPathApi({ path: pathData.addrPath });
            }
          }
        } finally {
          spinning.value = false;
        }
      }
      async function handlePathParent(path: string) {
        try {
          spinning.value = true;
          const parent = await getParentPathApi({ path: path });
          spinning.value = false;
          await handlePathIn(parent);
        } catch (e) {
          spinning.value = false;
        }
      }
      async function handleSubmit() {
        if (!pathData.addrPath) {
          message.error('请选择文件夹');
          return;
        }
        setModalProps({ confirmLoading: true });
        const isDirectory = await isDirectoryApi({ path: pathData.addrPath });
        if (!isDirectory) {
          message.error('该路径不可用');
          setModalProps({ confirmLoading: false });
          return;
        }
        closeModal();
        emit('success', { value: pathData.addrPath });
        setModalProps({ confirmLoading: false });
      }
      return {
        registerModal,
        theme,
        spinning,
        readonly,
        pathData,
        handlePathIn,
        handlePathParent,
        handleSubmit,
      };
    },
  });
</script>

<style scoped lang="less">
  .dialog-left {
    padding: 24px 14px 14px 14px;
  }
  .dialog-left-title {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
  }
  .dialog-left-content {
    height: calc(45vh - 112px);
    margin: 0;
    overflow-y: scroll;
  }
  .dialog-right {
    margin-left: 14px;
    padding: 24px 14px 0 14px;
  }
  .dialog-right-content {
  }
  .dialog-right-content-ul {
    margin-top: 14px;
    margin-bottom: 0;
    height: calc(45vh - 108px);
    overflow-y: scroll;
  }
  .dialog-right-content-ul p {
    text-align: left;
    width: 100%;
    cursor: pointer;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
  }
  .dark-theme {
    background-color: rgba(255, 255, 255, 0.04);
  }
  .light-theme {
    background-color: #f3f3f3;
  }
</style>
