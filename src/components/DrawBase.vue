<script setup>
import { useParamStore } from '../store/paramStore';
import DrawSector from './DrawSector.vue';
import TypeDivider from './TypeDivider.vue';

const store = useParamStore()

const props = defineProps({
  bgColor: String,
  bgColor2: String,
})

</script>

<template>
  <DrawSector
    v-for="sector of store.sectors"
    :sector="sector"
    :bgColor="sector.sLevel % 2 === 0 ? bgColor : bgColor2"
  />
  <TypeDivider
    v-for="dAngle of store.params.dividerAngles"
    :startRadius="store.params.innerRadius"
    :endRadius="store.params.outerRadius + 50 * store.circleNum * store.scaleMultiplier"
    :angle="dAngle"
  />
</template>

<style scoped>
</style>
