<script setup>
import DrawCanvas from './components/DrawCanvas.vue';
import { labels } from './legacy/labelsNew';
import { onMounted, ref } from 'vue';

const cmkd = ref()

const clickedElement = (info) => {
  console.log(info)
}

onMounted(() => {
  setTimeout(() => {
    // загрузка изображения карты - cmkd.value.downloadURI()
  }, 1000)
})
</script>

<template>
  <DrawCanvas 
    ref="cmkd"
    drawingMode='score'
    :width="800"
    :labels="labels"
    :position='9' 
    :showSupportRect="false"
    :showImportant="true" 
    @clicked="clickedElement"
  />
</template>

<style scoped>
</style>
