<script setup lang="ts">
import { computed } from "vue";
import { useParamStore } from "../store/paramStore";
import DrawSector from "./DrawSector.vue";
import TypeDivider from "./TypeDivider.vue";

const store = useParamStore();

defineProps<{
  bgColor: string;
  bgColor2: string;
}>();

const startRadius = computed(() => store.radiuses.value.innerRadius);
const endRadius = computed(
  () =>
    store.radiuses.value.outerRadius +
    50 * store.circleNum.value * store.scaleMultiplier.value,
);
</script>

<template>
  <DrawSector
    v-for="sector of store.sectors.value"
    :key="sector.object.id"
    :sector="sector"
    :bgColor="sector.sLevel % 2 === 0 ? bgColor : bgColor2"
  />
  <TypeDivider
    v-for="dAngle of store.angles.value.dividerAngles"
    :key="`${store.reloadCount}-${dAngle}-type-divider`"
    :startRadius="startRadius"
    :endRadius="endRadius"
    :angle="dAngle"
  />
</template>

<style scoped></style>

