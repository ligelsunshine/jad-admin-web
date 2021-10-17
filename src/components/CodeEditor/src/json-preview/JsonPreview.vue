<template>
  <div class="container">
    <div class="copy" v-if="copyButton"><a-button @click="handleCopy">复制</a-button></div>
    <vue-json-pretty v-bind="$attrs" :path="'res'" :data="data" :showLength="true" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, unref } from 'vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

  export default defineComponent({
    name: 'JsonPreview',
    components: { VueJsonPretty },
    props: { data: Object, copyButton: { type: Boolean, default: false } },
    setup(props) {
      const { clipboardRef, copiedRef } = useCopyToClipboard();
      const { createMessage } = useMessage();

      function handleCopy() {
        clipboardRef.value = JSON.stringify(props.data, null, 2);
        if (unref(copiedRef)) {
          createMessage.success('复制成功');
        }
      }
      return {
        handleCopy,
      };
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
