<script setup lang="ts">
import DrawLabels from "./DrawLabels.vue";
import DrawLineBtwElements from "./DrawLineBtwElements.vue";
import { useClickedStore } from "../store/clickedStore";
import type { Line } from "../types/line";
import type { Label } from "../types";

const clickedStore = useClickedStore();

const labels1: { label: Label; shadowed: boolean }[] = [];
const lines: Line[] = [];
if (clickedStore.clickedLabel.value?.objLabel)
  labels1.push({
    label: clickedStore.clickedLabel.value?.objLabel,
    shadowed: true,
  });

clickedStore.clickedLabel.value?.nextLabels.map((nLabel) => {
  labels1.push({
    label: nLabel,
    shadowed: false,
  });
  if (clickedStore.clickedLabel.value?.objLabel)
    lines.push({
      objLabelIn: clickedStore.clickedLabel.value?.objLabel,
      objLabelOut: nLabel,
    });
});
clickedStore.clickedLabel.value?.prevLabels.map((pLabel) => {
  labels1.push({
    label: pLabel,
    shadowed: false,
  });
  if (clickedStore.clickedLabel.value?.objLabel)
    lines.push({
      objLabelIn: pLabel,
      objLabelOut: clickedStore.clickedLabel.value?.objLabel,
    });
});
</script>

<template>
  <DrawLineBtwElements
    v-for="line of lines"
    :key="String(line.objLabelIn.id) + line.objLabelOut.id"
    :objLabelIn="line.objLabelIn"
    :objLabelOut="line.objLabelOut"
  />
  <DrawLabels
    v-for="label of labels1"
    :key="label.label.id"
    :objLabel="label.label"
    :shadowed="label.shadowed"
  />
</template>

<style scoped></style>

