<script setup>
import DrawLabels from './DrawLabels.vue'
import DrawLineBtwElements from './DrawLineBtwElements.vue'
const props = defineProps({
  clickedElement: Object,
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

const emit = defineEmits(["setClickedElement", "setClickedLine", "setActionItem", "setClickedInfo"])

const setClickedInfo = () => {}

const setActionItem = () => {}

const setClickedElement = () => {}

const setClickedLine = () => {}

const labels1 = []
const lines = []

labels1.push(props.clickedElement.objLabel)

props.clickedElement.nextLabels.map((nLabel) => {
  labels1.push(nLabel)
  lines.push({
    objLabelIn: props.clickedElement.objLabel,
    objLabelOut: nLabel
  })
})
props.clickedElement.prevLabels.map((pLabel) => {
  labels1.push(pLabel)
  lines.push({
    objLabelIn: pLabel,
    objLabelOut: props.clickedElement.objLabel,
  })
})

</script>

<template>
  <DrawLineBtwElements
    v-for="line of lines"
    :x="x"
    :y="y"
    :params="params"
    :objLabelIn="line.objLabelIn"
    :objLabelOut="line.objLabelOut"
    :scaleMultiplier="scaleMultiplier"
    :flags="flags"
    @setClickedLine="setClickedLine"
    @setClickedElement="setClickedElement"
    @setActionItem="setActionItem"
    @setClickedInfo="setClickedInfo"
    :discNum="discNum"
  />
  <DrawLabels
    v-for="label of labels1"
    :x="x"
    :y="y"
    :params="params"
    :flags="flags"
    :sizeMultiplier="sizeMultiplier"
    :objLabel="label"
    :scaleMultiplier="scaleMultiplier"
    shadowed
    @setActionItem="setActionItem"
    @setClickedInfo="setClickedInfo"
    :position="position"
  />
</template>

<style scoped>
</style>
