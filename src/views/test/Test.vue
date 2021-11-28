<template>
  <div>
    <img :src="url" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { defHttp } from '/@/utils/http/axios';

  export default defineComponent({
    setup() {
      const base64 = ref<string>('');
      const url = ref<string>('');
      // defHttp.get({ url: '/sys/file/base64/9ad0344306ef45ee7464d04235b1e015' }).then((res) => {
      //   base64.value = res.data.data;
      // });
      defHttp
        .get(
          { url: '/sys/file/url/9ad0344306ef45ee7464d04235b1e015' },
          { isTransformResponse: false }
        )
        .then((res) => {
          url.value = res.data.data;
        });
      return {
        base64,
        url,
      };
    },
  });
</script>

<style scoped></style>
