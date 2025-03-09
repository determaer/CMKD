<script setup>
import DrawLabels from './DrawLabels.vue';
import DrawLineBtwElements from './DrawLineBtwElements.vue';
import { useClickedStore } from '../store/clickedStore';

const clickedStore = useClickedStore()

</script>

<template>
  <DrawLabels
    :objLabel="clickedStore.clickedLine.objLabelIn"
  />
  <DrawLabels
    :objLabel="clickedStore.clickedLine.objLabelOut"
  />
  <DrawLineBtwElements
    :objLabelIn="clickedStore.clickedLine.objLabelIn"
    :objLabelOut="clickedStore.clickedLine.objLabelOut"
  />
</template>

<style scoped>
</style>
