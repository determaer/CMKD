<script setup>
import DrawSector from './DrawSector.vue';

defineProps({
  x: Number,
  y: Number,
  clickedSector: Object,
  params: Object,
  scaleMultiplier: Number,
  sizeMultiplier: Number,
  flags: Object,
})

const emit = defineEmits(["setClickedInfo", "setClickedSector"])

const setClickedInfo = () => {}

const setClickedSector = () => {}

</script>

<template>
  <DrawSector
    :x="x"
    :y="y"
    :sector="clickedSector.sector"
    :params="params"
    bgColor='gray'
    :scaleMultiplier="scaleMultiplier"
    :sizeMultiplier="sizeMultiplier"
    :flags="flags"
    @setClickedInfo="setClickedInfo"
    @setClickedSector="setClickedSector"
    :opacity=0.5
  />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
