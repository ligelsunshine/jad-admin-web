<template>
  <Spin :spinning="loading">
    <Row :gutter="24">
      <Col :span="14">
        <BasicForm @register="register" />
      </Col>
      <Col :span="10">
        <div class="change-avatar">
          <div class="mb-2">头像</div>
          <CropperAvatar
            :uploadApi="uploadApi"
            :value="avatar"
            btnText="更换头像"
            :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
            @change="updateAvatar"
            width="150"
          />
        </div>
      </Col>
    </Row>
    <Row>
      <Col :align="'center'">
        <Button type="primary" @click="handleSubmit"> 更新基本信息 </Button>
      </Col>
    </Row>
  </Spin>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { Button, Row, Col, Spin } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CropperAvatar } from '/@/components/Cropper';
  import { useUserStore } from '/@/store/modules/user';

  import { getUserAvatar, getUserInfo, updateUser } from '/@/api/sys/user';
  import { uploadApi } from '/@/api/file-store/Upload.api';
  import { baseSettingsSchemas } from './settings.data';

  export default defineComponent({
    name: 'BasicSettings',
    components: {
      BasicForm,
      Button,
      Row,
      Col,
      Spin,
      CropperAvatar,
    },
    setup() {
      const userStore = useUserStore();
      const loading = ref(false);

      const [register, { setFieldsValue, validate }] = useForm({
        labelWidth: 120,
        schemas: baseSettingsSchemas,
        showActionButtonGroup: false,
      });

      const avatar = ref('');
      const avatarBase64 = ref('');
      onMounted(async () => {
        const response = await getUserInfo();
        const { user } = response.data?.data;
        await setFieldsValue(user);
        avatar.value = user.avatar;
        avatarBase64.value = await getUserAvatar(user.avatar);
      });

      function updateAvatar({ data }) {
        avatar.value = data.id;
      }

      async function handleSubmit() {
        try {
          const values = await validate();
          loading.value = true;
          values.avatar = avatar.value;
          await updateUser(values);
          userStore.setUserInfo(values);
        } catch (e) {
          console.error(e);
        } finally {
          loading.value = false;
        }
      }
      return {
        register,
        loading,
        avatar: avatarBase64,
        uploadApi: uploadApi as any,
        updateAvatar,
        handleSubmit,
      };
    },
  });
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
</style>
