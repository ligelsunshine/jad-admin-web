<template>
  <div>
    <a-input-search
      v-bind="$attrs"
      placeholder="前端代码生成路径"
      enter-button="选择"
      :value="path"
      @search="handleSelect"
    />
    <Selector @register="registerModal" @success="handleSuccess" :readonly="props.readonly" />
  </div>
</template>

<script>
  import { defineComponent, ref, watch } from 'vue';
  import { useModal } from '/@/components/Modal';
  import Selector from '/@/components/Selector/Selector.vue';

  export default defineComponent({
    name: 'LocalPathSelect',
    components: { Selector },
    props: {
      value: {
        type: String,
        default: '',
      },
      readonly: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    setup: function (props, context) {
      const [registerModal, { openModal }] = useModal();
      let path = ref(props.value);
      watch(
        () => props.value,
        (val) => {
          // 查看父组件传过来的值是否变化，从而修改值
          path.value = val;
        }
      );
      watch(
        () => path.value,
        (val) => {
          // 查看子组件值是否变化，在赋值给父组件
          context.emit('update:value', val);
        }
      );
      function handleSelect() {
        openModal(true, {
          value: props.value,
          readonly: props.readonly,
        });
      }
      function handleSuccess({ value }) {
        path.value = value;
      }
      return {
        registerModal,
        props,
        path,
        handleSelect,
        handleSuccess,
      };
    },
  });
</script>
