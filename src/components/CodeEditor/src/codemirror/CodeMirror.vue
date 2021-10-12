<template>
  <div class="container">
    <div class="copy"><a-button @click="handleCopy">复制</a-button></div>
    <div class="relative !h-full w-full overflow-hidden codemirror" ref="el"> </div>
  </div>
</template>

<script lang="ts">
  import {
    ref,
    onMounted,
    onUnmounted,
    watchEffect,
    watch,
    defineComponent,
    unref,
    nextTick,
  } from 'vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDebounceFn } from '@vueuse/core';
  import { useAppStore } from '/@/store/modules/app';
  import CodeMirror from 'codemirror';
  // css
  import './codemirror.css';
  import 'codemirror/theme/idea.css';
  import 'codemirror/theme/material-palenight.css';
  // modes
  import 'codemirror/mode/javascript/javascript';
  import 'codemirror/mode/vue/vue';
  import 'codemirror/mode/css/css';
  import 'codemirror/mode/htmlmixed/htmlmixed';
  import 'codemirror/mode/sql/sql';
  import 'codemirror/mode/xml/xml';
  import 'codemirror/mode/clike/clike';

  const props = {
    mode: { type: String, default: 'application/json' },
    value: { type: String, default: '' },
    readonly: { type: Boolean, default: false },
  };

  export default defineComponent({
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const el = ref();
      let editor: Nullable<CodeMirror.Editor>;

      const debounceRefresh = useDebounceFn(refresh, 100);
      const appStore = useAppStore();
      const { clipboardRef, copiedRef } = useCopyToClipboard();
      const { createMessage } = useMessage();

      watch(
        () => props.value,
        async (value) => {
          await nextTick();
          const oldValue = editor?.getValue();
          if (value !== oldValue) {
            editor?.setValue(value ? value : '');
          }
        },
        { flush: 'post' }
      );

      watchEffect(() => {
        editor?.setOption('mode', props.mode);
      });

      watch(
        () => appStore.getDarkMode,
        async () => {
          setTheme();
        },
        {
          immediate: true,
        }
      );

      function setTheme() {
        unref(editor)?.setOption(
          'theme',
          appStore.getDarkMode === 'light' ? 'idea' : 'material-palenight'
        );
      }

      function refresh() {
        editor?.refresh();
      }

      async function init() {
        const addonOptions = {
          autoCloseBrackets: true,
          autoCloseTags: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers'],
        };

        editor = CodeMirror(el.value!, {
          value: '',
          mode: props.mode,
          readOnly: props.readonly,
          tabSize: 2,
          theme: 'material-palenight',
          lineWrapping: false,
          lineNumbers: true,
          spellcheck: true,
          autocorrect: true,
          ...addonOptions,
        });
        editor?.setValue(props.value);
        setTheme();
        editor?.on('change', () => {
          emit('change', editor?.getValue());
        });
      }

      onMounted(async () => {
        await nextTick();
        init();
        useWindowSizeFn(debounceRefresh);
      });

      onUnmounted(() => {
        editor = null;
      });

      function handleCopy() {
        clipboardRef.value = editor?.getValue();
        if (unref(copiedRef)) {
          createMessage.success('复制成功');
        }
      }
      return { el, handleCopy };
    },
  });
</script>
<style scoped>
  .codemirror {
    overflow-y: scroll;
    -ms-overflow-y: scroll;
    max-height: 760px;
  }
  .copy {
    position: absolute;
    z-index: 10;
    right: 0;
    /*display: none;*/
    -webkit-transition: opacity 0.3s linear;
    -moz-transition: opacity 0.3s linear;
    -o-transition: opacity 0.3s linear;
    transition: opacity 0.3s linear;
    opacity: 0;
    filter: alpha(opacity=0);
  }
  .container:hover .copy {
    opacity: 100;
    filter: alpha(opacity=100);
  }
</style>
