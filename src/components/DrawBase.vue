<script setup lang="ts">
import { useParamStore } from '../store/paramStore';
import DrawSector from './DrawSector.vue';
import TypeDivider from './TypeDivider.vue';

const store = useParamStore()

defineProps({
  bgColor: String,
  bgColor2: String,
})

</script>

<template>
  <DrawSector
    v-for="sector of store.sectors.value"
    :sector="sector"
    :bgColor="sector.sLevel % 2 === 0 ? bgColor : bgColor2"
  />
  <TypeDivider
    v-for="dAngle of store.params.value.dividerAngles"
    :startRadius="store.params.value.innerRadius"
    :endRadius="store.params.value.outerRadius + 50 * store.circleNum.value * store.scaleMultiplier.value"
    :angle="dAngle"
  />
</template>

<style scoped>
</style>
