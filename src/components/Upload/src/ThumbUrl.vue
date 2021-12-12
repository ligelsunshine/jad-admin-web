<template>
  <span class="thumb">
    <Image
      v-if="fileUrl"
      :src="fileUrl"
      :width="104"
      fallback="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIiBjbGFzcz0iaWNvbmlmeSBpY29uaWZ5LS1tZGkiIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGQ9Ik0xNCAySDZhMiAyIDAgMCAwLTIgMnYxNmMwIDEuMTEuODkgMiAyIDJoMTJjMS4xMSAwIDItLjg5IDItMlY4bC02LTZtNCAxOEg2VjRoN3Y1aDV2MTFtLTMtN2MwIDEuODktMi4yNSAyLjA3LTIuMjUgMy43NmgtMS41YzAtMi40NCAyLjI1LTIuMjYgMi4yNS0zLjc2YzAtLjgyLS42Ny0xLjUtMS41LTEuNXMtMS41LjY4LTEuNSAxLjVIOWMwLTEuNjUgMS4zNC0zIDMtM3MzIDEuMzUgMyAzbS0yLjI1IDQuNVYxOWgtMS41di0xLjVoMS41eiIgZmlsbD0iY3VycmVudENvbG9yIj48L3BhdGg+PC9zdmc+"
    />
  </span>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import { Image } from 'ant-design-vue';

  export default defineComponent({
    components: { Image },
    props: {
      fileUrl: propTypes.string.def(''),
      fileName: propTypes.string.def(''),
    },
  });
</script>
<style lang="less">
  .thumb {
    img {
      position: static;
      display: block;
      cursor: zoom-in;
      border-radius: 4px;
      object-fit: cover;
    }
  }
</style>
