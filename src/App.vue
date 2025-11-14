<script setup lang="ts">
import CMKD from "./components/CMKD.vue";
import { labels } from "./legacy/labelsNew.ts";
import { onMounted, ref /*, useTemplateRef*/ } from "vue";

//const cmkd = useTemplateRef("cmkd");
const showSupportRect = ref(true);
const labelref = ref(labels);

onMounted(() => {
  setTimeout(() => {
    // загрузка изображения карты - cmkd.value?.downloadURI();
    labelref.value.push({
      id: 1500,
      prop: 0,
      typeText: "u",
      numText: "1",
      type: "circle",
      num: 1,
      score: 1,
      isBase: true,
      connections: [99],
      secStart: true,
      secEnd: true,
      fontStyle: "normal",
      arrowOut: false,
      arrowIn: false,
      level: 0,
      isLabel: true,
      secLength: 1,
      grey: false,
      sectorName: "",
      drawAnyCase: true,
    });
    console.log(labelref.value);
  }, 3000);
});
</script>

<template>
  <input type="checkbox" v-model="showSupportRect" />
  <CMKD
    ref="cmkd"
    drawingMode="default"
    :width="800"
    :labels="labelref"
    :position="99"
    :showSupportRect="showSupportRect"
    :showImportant="false"
    :showDefaultRect="false"
    @clicked="
      (info) => {
        console.log(info);
      }
    "
  />
</template>

<style scoped></style>
