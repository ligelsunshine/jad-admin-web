<template>
  <div class="h-full">
    <CodeMirrorEditor
      v-bind="$attrs"
      :value="model.data"
      @change="handleValueChange"
      @blur="handleBlur"
      :mode="mode"
      :readonly="readonly"
      :copyButton="copyButton"
      :maxHeight="maxHeight"
    />
    <Alert v-show="model.success" message="JSON格式错误" :description="model.msg" type="error" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import CodeMirrorEditor from './codemirror/CodeMirror.vue';
  import { Alert } from 'ant-design-vue';

  import { validateJson } from '/@/utils/jsonUtil';
  import { Result } from '/@/api/data';

  const MODE = {
    JSON: 'application/json',
    html: 'htmlmixed',
    js: 'javascript',
  };

  const props = {
    value: { type: [Object, String] as PropType<Record<string, any> | string> },
    mode: { type: String, default: MODE.JSON },
    readonly: { type: Boolean, default: false },
    validate: { type: Boolean, default: false },
    copyButton: { type: Boolean, default: false },
    maxHeight: { type: String, default: null },
  };

  export default defineComponent({
    name: 'CodeEditor',
    components: { CodeMirrorEditor, Alert },
    props,
    emits: ['change', 'error', 'update:value'],
    setup(props, { emit }) {
      const model = ref<Result>({
        data: props.value,
      });
      watch(
        () => props.value,
        () => {
          const { value, mode } = props;
          if (mode !== MODE.JSON) {
            model.value.data = value as string;
          } else {
            model.value.data = validateJson(value).value;
          }
        }
      );
      watch(
        () => model.value.data,
        (val) => {
          emit('update:value', val);
        }
      );
      function handleValueChange(v) {
        model.value.data = validateJson(v).value;
        emit('change', v);
      }

      function handleBlur(v) {
        const result = validateJson(v);
        if (props.validate && result.error) {
          model.value.success = true;
          model.value.msg = result.message;
          emit('error', model);
        } else {
          model.value.success = false;
        }
      }
      return { model, handleValueChange, handleBlur };
    },
  });
</script>
