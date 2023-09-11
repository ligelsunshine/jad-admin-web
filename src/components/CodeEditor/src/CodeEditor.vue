<template>
  <div class="h-full">
    <CodeMirrorEditor
      :value="getValue"
      @change="handleValueChange"
      @blur="handleBlur"
      :mode="mode"
      :readonly="readonly"
    />
    <Alert v-show="hasError" message="JSON格式错误" :description="error" type="error" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  import CodeMirrorEditor from './codemirror/CodeMirror.vue';
  import { Alert } from 'ant-design-vue';

  import { validateJson } from '/@/utils/jsonUtil';

  const MODE = {
    JSON: 'application/json',
    html: 'htmlmixed',
    js: 'javascript',
  };

  const props = {
    value: { type: [Object, String] as PropType<Record<string, any> | string> },
    mode: { type: String, default: MODE.JSON },
    readonly: { type: Boolean },
  };

  export default defineComponent({
    name: 'CodeEditor',
    components: { CodeMirrorEditor, Alert },
    props,
    emits: ['change', 'error'],
    setup(props, { emit }) {
      const hasError = ref<boolean>(false);
      const error = ref<string>('');
      const getValue = computed(() => {
        const { value, mode } = props;
        if (mode !== MODE.JSON) {
          return value as string;
        }
        return validateJson(value).value;
      });


      function handleValueChange(v) {
        emit('change', v);
      }

      function handleBlur(v) {
        const result = validateJson(v);
        if (result.error) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          hasError.value = true;
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          error.value = result.message;
          emit('error', result);
        } else {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          hasError.value = false;
        }
      }
      return { hasError, error, handleValueChange, handleBlur, getValue };
    },
  });
</script>
