<script setup>
import DrawLabels from './DrawLabels.vue';
import DrawLineBtwElements from './DrawLineBtwElements.vue';
import { useClickedStore } from '../store/clickedStore';

const clickedStore = useClickedStore()

</script>

<template>
  <DrawLabels
    :objLabel="clickedStore.clickedLine.value.objLabelIn"
  />
  <DrawLabels
    :objLabel="clickedStore.clickedLine.value.objLabelOut"
  />
  <DrawLineBtwElements
    :objLabelIn="clickedStore.clickedLine.value.objLabelIn"
    :objLabelOut="clickedStore.clickedLine.value.objLabelOut"
  />
</template>

<style scoped>
</style>
