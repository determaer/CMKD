<script setup lang="ts">
import CMKD from "./components/CMKD.vue";
import { labels } from "./legacy/labelsNew.ts";
import { onMounted /*, useTemplateRef*/ } from "vue";

//const cmkd = useTemplateRef("cmkd");

onMounted(() => {
  setTimeout(() => {
    // загрузка изображения карты - cmkd.value?.downloadURI();
  }, 1000);
});
</script>

<template>
  <CMKD
    ref="cmkd"
    drawingMode="score"
    :width="800"
    :labels="labels"
    :position="99"
    :showSupportRect="false"
    :showImportant="false"
    @clicked="
      (info) => {
        console.log(info);
      }
    "
  />
</template>

<style scoped></style>
