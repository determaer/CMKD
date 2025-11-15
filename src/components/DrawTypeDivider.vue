<script setup lang="ts">
import { useParamStore } from "../store/paramStore";
import DrawAngledLine from "./DrawAngledLine.vue";

const store = useParamStore();

defineProps<{
  startRadius: number;
  endRadius: number;
  angle: number;
}>();
</script>

<template>
  <DrawAngledLine
    :key="`${store.reloadCount}-${angle}-${startRadius}-${endRadius}-outter-line`"
    :startRadius="startRadius"
    :endRadius="endRadius"
    :angle="angle"
    color="black"
    :width="5 * store.scaleMultiplier.value"
  />
  <DrawAngledLine
    :key="`${store.reloadCount}-${angle}-${startRadius}-${endRadius}-inner-line`"
    :startRadius="startRadius - 2"
    :endRadius="endRadius + 2"
    :angle="angle"
    color="white"
    :width="2 * store.scaleMultiplier.value"
  />
</template>

<style scoped></style>
