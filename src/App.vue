<script setup>
import DrawCanvas from './components/DrawCanvas.vue';
import { labels } from './legacy/labelsNew';

</script>

<template>
  <DrawCanvas 
    :scaleMultiplier='1'
    drawingMode='score'
    :labels="labels"
    :redFlags="[null]"
    :oneLevel="true"
    :dialogSized="false"
    :position='99' 
    :extShowSupportRect="false"
    showImportant
  />
</template>

<style scoped>

</style>
