<script setup lang="ts">
import CMKD from './components/CMKD.vue';
import { labels } from './legacy/labelsNew.ts';
import { onMounted, ref } from 'vue';

const cmkd = ref()

onMounted(() => {
  setTimeout(() => {
    // загрузка изображения карты - cmkd.value.downloadURI()
  }, 1000)
})
</script>

<template>
  <CMKD 
    ref="cmkd"
    drawingMode='score'
    :width="800"
    :labels="labels"
    :position='9' 
    :showSupportRect="false"
    :showImportant="true" 
    @clicked="(info) => {console.log(info)}"
  />
</template>

<style scoped>
</style>
