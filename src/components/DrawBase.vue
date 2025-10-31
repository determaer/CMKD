<script setup lang="ts">
import { useParamStore } from "../store/paramStore";
import DrawSector from "./DrawSector.vue";
import TypeDivider from "./TypeDivider.vue";

const store = useParamStore();

defineProps<{
  bgColor: string;
  bgColor2: string;
}>();
</script>

<template>
  <DrawSector
    v-for="sector of store.sectors.value"
    :key="sector.object.id"
    :sector="sector"
    :bgColor="sector.sLevel % 2 === 0 ? bgColor : bgColor2"
  />
  <TypeDivider
    v-for="dAngle of store.params.value.dividerAngles"
    :key="dAngle"
    :startRadius="store.params.value.innerRadius"
    :endRadius="
      store.params.value.outerRadius +
      50 * store.circleNum.value * store.scaleMultiplier.value
    "
    :angle="dAngle"
  />
</template>

<style scoped></style>
