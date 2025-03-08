<script setup>
import DrawLabels from './DrawLabels.vue';
import DrawLineBtwElements from './DrawLineBtwElements.vue';
defineProps({
  clickedLine: Object,
  params: Object,
  x: Number,
  y: Number,
  flags: Object,
  sizeMultiplier: Number,
  scaleMultiplier: Number,
  labels: Array,
  discNum: Number,
  position: Number,
})

const emit = defineEmits(["setClickedElement", "setClickedLine", "setActionItem", "setClickedInfo",])

const setClickedInfo = () => {}

const setActionItem = () => {}

const setClickedElement = () => {}

const setClickedLine = () => {}


</script>

<template>
  <DrawLabels
    :x="x"
    :y="y"
    :params="params"
    :flags="flags"
    :sizeMultiplier="sizeMultiplier"
    :scaleMultiplier="scaleMultiplier"
    :objLabel="clickedLine.objLabelIn"
    @setClickedElement="setClickedElement"
    @setClickedLine="setClickedLine"
    :labels="labels"
    @setActionItem="setActionItem"
    @setClickedInfo="setClickedInfo"
    :position="position"
  />
  <DrawLabels
    :x="x"
    :y="y"
    :params="params"
    :flags="flags"
    :sizeMultiplier="sizeMultiplier"
    :objLabel="clickedLine.objLabelOut"
    :scaleMultiplier="scaleMultiplier"
    @setClickedElement="setClickedElement"
    @setClickedLine="setClickedLine"
    :labels="labels"
    @setActionItem="setActionItem"
    @setClickedInfo="setClickedInfo"
    :position="position"
  />
  <DrawLineBtwElements
    :x="x"
    :y="y"
    :params="params"
    :objLabelIn="clickedLine.objLabelIn"
    :objLabelOut="clickedLine.objLabelOut"
    :scaleMultiplier="scaleMultiplier"
    :flags="flags"
    @setClickedElement="setClickedElement"
    @setClickedLine="setClickedLine"
    @setActionItem="setActionItem"
    @setClickedInfo="setClickedInfo"
    :discNum="discNum"
  />
</template>

<style scoped>
</style>
