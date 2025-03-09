<script setup>
import { useParamStore } from '../store/paramStore';
import DrawSector from './DrawSector.vue';
import TypeDivider from './TypeDivider.vue';

const store = useParamStore()

const props = defineProps({
  bgColor: String,
  bgColor2: String,
  sectors: Array,
})
    
const emit = defineEmits(['setClickedInfo', "setClickedSector"])

const setClickedInfo = () => {}

const setClickedSector = () => {}

console.log(props.sectors)

</script>

<template>
  <DrawSector
    v-for="sector of sectors"
    :sector="sector"
    :bgColor="sector.sLevel % 2 === 0 ? bgColor : bgColor2"
    @setClickedInfo="setClickedInfo"
    @setClickedSector="setClickedSector"
  />
  <TypeDivider
    v-for="dAngle of store.params.dividerAngles"
    :startRadius="store.params.innerRadius"
    :endRadius="store.params.outerRadius + 50 * store.circleNum * store.scaleMultiplier"
    :angle="dAngle"
  />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
