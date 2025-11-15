<script setup lang="ts">
import DrawLabels from "./DrawLabels.vue";
import DrawLine from "./DrawLine.vue";
import { useClickedStore } from "../store/clickedStore";

const clickedStore = useClickedStore();
</script>

<template>
  <DrawLine
    v-for="line of clickedStore.linesToDraw.value"
    :key="String(line.objLabelIn.id) + line.objLabelOut.id"
    :objLabelIn="line.objLabelIn"
    :objLabelOut="line.objLabelOut"
  />
  <DrawLabels
    v-for="label of clickedStore.labelsToDraw.value"
    :key="label.label.id"
    :objLabel="label.label"
    :selected="label.selected"
  />
</template>

<style scoped></style>

