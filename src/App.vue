<script setup lang="ts">
import CMKD from "./components/CMKD.vue";
import { oneLevelCMKD1 } from "./stories/cmkd-sets/oneLevelStandardCMKD1";
import { onMounted, ref /*, useTemplateRef*/ } from "vue";

//const cmkd = useTemplateRef("cmkd");
const showSupportRect = ref<"default" | "score" | "light">("default");
const labelref = ref(oneLevelCMKD1);
onMounted(() => {
  setTimeout(() => {
    // загрузка изображения карты - cmkd.value?.downloadURI();
    labelref.value.push({
      id: 1500,
      prop: 1,
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
    });

    console.log(labelref.value);
  }, 3000);
});
</script>

<template>
  <select v-model="showSupportRect">
    <option value="default">Базовая</option>
    <option value="score">Частная</option>
    <option value="light">Частная упрощённая</option>
  </select>
  <CMKD
    ref="cmkd"
    :drawingMode="showSupportRect"
    :width="800"
    :labels="labelref"
    :position="99"
    :showSupportRect="false"
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
