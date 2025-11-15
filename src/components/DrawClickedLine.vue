<script setup lang="ts">
import DrawLabels from "./DrawLabels.vue";
import DrawLine from "./DrawLine.vue";
import { useClickedStore } from "../store/clickedStore";

const clickedStore = useClickedStore();
</script>

<template>
  <DrawLabels
    v-if="clickedStore.clickedLine.value?.objLabelIn"
    :objLabel="clickedStore.clickedLine.value?.objLabelIn"
  />
  <DrawLabels
    v-if="clickedStore.clickedLine.value?.objLabelOut"
    :objLabel="clickedStore.clickedLine.value?.objLabelOut"
  />
  <DrawLine
    v-if="
      clickedStore.clickedLine.value?.objLabelIn &&
      clickedStore.clickedLine.value?.objLabelOut
    "
    :objLabelIn="clickedStore.clickedLine.value?.objLabelIn"
    :objLabelOut="clickedStore.clickedLine.value?.objLabelOut"
  />
</template>

<style scoped></style>

