<template>
  <div class="rectangle-wrap">
    <div class="rectangle-content-wrap">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
</script>
<script lang="ts">
export default { name: 'RectangleWrap' };
</script>

<style lang="less" scoped>
.rectangle-wrap {
  position: relative;

  &::before {
    content: '';
    display: block;
    width: 100%;
    padding-top: 75%;
  }
}

.rectangle-content-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
