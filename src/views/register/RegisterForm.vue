<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="type" class="enter-x">
        <RadioGroup v-model:value="formData.type" buttonStyle="solid" :style="{ width: '100%' }">
          <RadioButton value="2" :style="{ width: '33.33%', textAlign: 'center' }"
            >普通注册</RadioButton
          >
          <RadioButton value="3" :style="{ width: '33.33%', textAlign: 'center' }"
            >手机注册</RadioButton
          >
          <RadioButton value="4" :style="{ width: '33.33%', textAlign: 'center' }"
            >邮箱注册</RadioButton
          >
        </RadioGroup>
      </FormItem>
      <FormItem name="mobile" class="enter-x">
        <Input size="large" v-model:value="formData.mobile" :placeholder="t('sys.login.mobile')" />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <CountdownInput
          size="large"
          v-model:value="formData.sms"
          :placeholder="t('sys.login.smsCode')"
        />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <FormItem class="enter-x" name="policy">
        <!-- No logic, you need to deal with it yourself -->
        <Checkbox v-model:checked="formData.policy" size="small">
          {{ t('sys.login.policy') }}
        </Checkbox>
      </FormItem>

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        {{ t('sys.login.registerButton') }}
      </Button>

      <Button size="large" block class="enter-x mt-4" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </template>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, unref, computed } from 'vue';

  import LoginFormTitle from '../login/LoginFormTitle.vue';
  import { Form, Radio, Input, Row, Col, Button, Checkbox } from 'ant-design-vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { CountdownInput } from '/@/components/CountDown';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from '../login/useLogin';

  export default defineComponent({
    name: 'RegisterPasswordForm',
    components: {
      [Col.name]: Col,
      [Row.name]: Row,
      Button,
      Form,
      FormItem: Form.Item,
      RadioGroup: Radio.Group,
      RadioButton: Radio.Button,
      Input,
      InputPassword: Input.Password,
      Checkbox,
      StrengthMeter,
      CountdownInput,
      LoginFormTitle,
    },
    setup() {
      const { t } = useI18n();
      const { handleBackLogin, setLoginState, getLoginState } = useLoginState();

      const formRef = ref();
      const loading = ref(false);

      const formData = reactive({
        type: '2',
        account: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        sms: '',
        policy: false,
      });

      const { getFormRules } = useFormRules(formData);
      const { validForm } = useFormValid(formRef);

      const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

      async function handleRegister() {
        const data = await validForm();
        if (!data) return;
        console.log(data);
      }

      return {
        t,
        formRef,
        formData,
        getFormRules,
        handleRegister,
        loading,
        handleBackLogin,
        setLoginState,
        LoginStateEnum,
        getShow,
      };
    },
  });
</script>
