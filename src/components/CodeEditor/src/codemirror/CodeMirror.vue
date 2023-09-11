<template>
  <div class="container">
    <div class="copy" v-if="copyButton"><a-button @click="handleCopy">复制</a-button></div>
    <div class="relative !h-full w-full overflow-hidden" ref="el"> </div>
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

  import './codemirror.css';

  // modes
  import 'codemirror/addon/comment/comment';
  import 'codemirror/addon/dialog/dialog.css';
  import 'codemirror/addon/dialog/dialog';
  import 'codemirror/addon/display/autorefresh';
  import 'codemirror/addon/edit/closebrackets';
  import 'codemirror/addon/edit/closetag';
  import 'codemirror/addon/edit/matchbrackets';
  import 'codemirror/addon/fold/brace-fold';
  import 'codemirror/addon/fold/comment-fold';
  import 'codemirror/addon/fold/foldcode';
  import 'codemirror/addon/fold/foldgutter.css';
  import 'codemirror/addon/fold/foldgutter';
  import 'codemirror/addon/fold/indent-fold';
  import 'codemirror/addon/fold/markdown-fold';
  import 'codemirror/addon/fold/xml-fold';
  import 'codemirror/addon/lint/coffeescript-lint';
  import 'codemirror/addon/lint/css-lint';
  // import 'codemirror/addon/lint/html-lint';
  // import 'codemirror/addon/lint/javascript-lint';
  // import 'codemirror/addon/lint/json-lint';
  import 'codemirror/addon/lint/lint.css';
  import 'codemirror/addon/lint/lint';
  import 'codemirror/addon/lint/yaml-lint';
  import 'codemirror/addon/scroll/annotatescrollbar';
  import 'codemirror/addon/search/search';
  import 'codemirror/addon/search/searchcursor';
  import 'codemirror/addon/search/jump-to-line';
  import 'codemirror/addon/search/matchesonscrollbar.css';
  import 'codemirror/addon/search/matchesonscrollbar';
  import 'codemirror/addon/selection/active-line' //光标行背景高亮，配置里面也需要styleActiveLine设置为true
  import 'codemirror/keymap/sublime';
  // import 'codemirror/lib/codemirror.css'; // 会让maxHeight失效
  import 'codemirror/mode/vue/vue';
  import 'codemirror/mode/css/css';
  import 'codemirror/mode/sql/sql';
  import 'codemirror/mode/xml/xml';
  import 'codemirror/mode/clike/clike';
  import 'codemirror/mode/htmlmixed/htmlmixed';
  import 'codemirror/mode/javascript/javascript';
  import 'codemirror/theme/idea.css';
  import 'codemirror/theme/material-palenight.css';


  const props = {
    mode: { type: String, default: 'application/json' },
    value: { type: String, default: '' },
    maxHeight: { type: String, default: null },
    readonly: { type: Boolean, default: false },
    copyButton: { type: Boolean, default: false },
  };

  export default defineComponent({
    props,
    emits: ['change', 'blur'],
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
          autoFormatOnLoad: true,
          autoRefresh: true,
          autoCloseBrackets: true,
          autoCloseTags: true,
          foldGutter: true,
          lint: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
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
          refresh();
        });
        editor.on('blur', ()=>{
          emit('blur', editor?.getValue())
          refresh();
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
        clipboardRef.value = <string>editor?.getValue();
        if (unref(copiedRef)) {
          createMessage.success('复制成功');
        }
      }
      return { el, handleCopy };
    },
    mounted() {
      const maxHeight = this.$props.maxHeight;
      if (maxHeight) {
        this.$refs.el.style.maxHeight = maxHeight;
        this.$refs.el.style.overflowY = 'scroll';
      }
    },
  });
</script>
<style scoped>
  .copy {
    position: absolute;
    z-index: 10;
    right: 0;
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
