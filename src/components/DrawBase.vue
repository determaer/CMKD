<script setup>
import DrawSector from './DrawSector.vue';
import TypeDivider from './TypeDivider.vue';
const props = defineProps({
  x: Number,
  y: Number,
  params: Object,
  scaleMultiplier: Number,
  sizeMultiplier: Number,
  bgColor: String,
  bgColor2: String,
  sectors: Array,
  circleNum: Number,
  flags: Object,
})
    
const emit = defineEmits('setClickedInfo', "setClickedSector")

const setClickedInfo = () => {}

const setClickedSector = () => {}

console.log(props.sectors)

</script>

<template>
  <DrawSector
    v-for="sector of sectors"
    :x="x"
    :y="y"
    :sector="sector"
    :params="params"
    :bgColor="sector.sLevel % 2 === 0 ? bgColor : bgColor2"
    :scaleMultiplier="scaleMultiplier"
    :sizeMultiplier="sizeMultiplier"
    :flags="flags"
    @setClickedInfo="setClickedInfo"
    @setClickedSector="setClickedSector"
  />
  <TypeDivider
    v-for="dAngle of params.dividerAngles"
    :x="x"
    :y="y"
    :startRadius="params.innerRadius"
    :endRadius="params.outerRadius + 50 * circleNum * scaleMultiplier"
    :angle="dAngle"
    :scaleMultiplier="scaleMultiplier"
  />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
