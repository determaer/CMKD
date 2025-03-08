<script setup>

import { computed, ref } from 'vue'
import { controlPoint } from '../helpers/controlPoint'
const props = defineProps({
  x: Number,
  y: Number,
  sector: Object,
  params: Object,
  bgColor: String,
  scaleMultiplier: Number,
  sizeMultiplier: Number,
  flags: Object,
  shadowed: Boolean,
  opacity: Number,
})

const emit = defineEmits(["setClickedInfo", "setClickedSector"]) 

const fill = ref(props.bgColor)
const scale = ref(1)

let arcLength = props.sector.sEnd - props.sector.sStart
let r = 0
if (props.sector.sEnd - arcLength / 2 > 90 && props.sector.sEnd - arcLength / 2 < 270)
  r = 1

const handleClick = () => {
  /*if (flags.oneLevel) {
    setClickedInfo({
      type: 'sector',
      id: sector.upperID,
    })
    setClickedSector({
      isClicked: true,
      sector: sector,
    })
  }*/
  //console.log('clicked sector of ' + sector.upperID)
}

let additional = 0
if (props.flags.showSupportRect) {
  additional = 50
}

const [labelX, labelY] = controlPoint(props.x, props.y, props.params.labelRadius + 50 * props.sector.sLevel * props.scaleMultiplier, 90 + (props.sector.sEnd - arcLength / 2))
const [nameX, nameY] = controlPoint(props.x, props.y, props.params.sectorNameRadius + additional, 90 + (props.sector.sEnd - arcLength / 2))

let fillColor = 'white'
if (props.sector.objLabel) {
  if (props.sector.objLabel.score > 0) {
    fillColor = 'green'
  }
  if (props.sector.objLabel.score < 0) {
    fillColor = 'red'
  }
}

const labelWithLabel = computed(() => {
  if (props.sector.objLabel && props.sector.objLabel.isLabel)
    return true
  else return false
})

const labelWithoutLabel = computed(() => {
  if (props.sector.objLabel && !props.sector.objLabel.isLabel)
    return true
  else return false
})

</script>

<template>
  <v-arc
    :x="x"
    :y="y"
    :angle="360 - arcLength"
    :rotation="-90 - sector.sStart"
    :outerRadius="params.outerRadius + 50 * sector.sLevel * scaleMultiplier "
    :innerRadius="params.innerRadius + 50 * sector.sLevel * scaleMultiplier"
    :fill="fill"
    stroke='black'
    :opacity="opacity"
    :clockwise="true"
    :strokeWidth="2 * scaleMultiplier"
    @click="handleClick"
    @mouseOver="() => {fill = 'gray'}"
    @mouseOut="() => {fill = bgColor}"
  />
  <v-text
    v-if="flags.showSectorName"
    :x="nameX"
    :y="nameY"
    :text="sector.shortname"
    :offset="{
      x: 20 * sizeMultiplier * scale * scaleMultiplier,
      y: 10 * sizeMultiplier * scale * scaleMultiplier,
    }"
    fontFamily='Times New Roman'
    :fontSize="22 * sizeMultiplier * scale * scaleMultiplier"
    :rotation="-(sector.sEnd - arcLength / 2) - 180 * r"
    @click="handleClick"
    @mouseOver="() => {fill = 'gray'}"
    @mouseOut="() => {fill = bgColor}"
  />
  <v-rect
    v-if="labelWithLabel"
    :x="labelX"
    :y="labelY"
    :width="36 * sizeMultiplier * scale * scaleMultiplier"
    :height= "36 * sizeMultiplier * scale * scaleMultiplier"
    fill='white'
    stroke='black'
    :strokeWidth="1 * scaleMultiplier"
    :offset="{
      x: 18 * sizeMultiplier * scale * scaleMultiplier,
      y: 18 * sizeMultiplier * scale * scaleMultiplier,
    }"
    :rotation="-(sector.sEnd - arcLength / 2)"
    @click="handleClick"
    @mouseOver="() => {scale = 1.5}"
    @mouseOut="() => {scale = 1}"
  />
  <v-rect
    v-if="labelWithLabel && flags.showScore"
    :x="labelX"
    :y="labelY"
    :width="36 * sizeMultiplier * scale * scaleMultiplier"
    :height="36 * sizeMultiplier * scale * scaleMultiplier"
    :opacity="Math.abs(sector.objLabel.score)"
    :fill="shadowed ? 'white' : fillColor"
    :stroke="shadowed ? fillColor : 'black'"
    :strokeWidth="1 * scaleMultiplier"
    :offset="{
      x: 18 * sizeMultiplier * scale * scaleMultiplier,
      y: 18 * sizeMultiplier * scale * scaleMultiplier,
    }"
    :rotation="-(sector.sEnd - arcLength / 2)"
    @click="handleClick"
    @mouseOver="() => {scale = 1.5}"
    @mouseOut="() => {scale = 1}"
  />
  <v-text
    v-if="labelWithLabel"
    :x="labelX"
    :y="labelY"
    :text="sector.objLabel.typeText"
    :offset="{
      x: 13 * sizeMultiplier * scale * scaleMultiplier,
      y: 10 * sizeMultiplier * scale * scaleMultiplier,
    }"
    fontFamily='Times New Roman'
    :fontSize= "22 * sizeMultiplier * scale * scaleMultiplier"
    :fontStyle="sector.objLabel.fontStyle"
    @click="handleClick"
    @mouseOver="() => {scale = 1.5}"
    @mouseOut="() => {scale = 1}"
  />
  <v-text
    v-if="labelWithLabel"
    :x="labelX"
    :y="labelY"
    :text="sector.objLabel.numText"
    :offset="{
      x: 1 * sizeMultiplier * scale * scaleMultiplier,
      y: 2 * sizeMultiplier * scale * scaleMultiplier,
    }"
    fontFamily='Times New Roman'
    :fontSize="16 * sizeMultiplier * scale * scaleMultiplier"
    :fontStyle="sector.objLabel.fontStyle"
    @click="handleClick"
    @mouseOver="() => {scale = 1.5}"
    @mouseOut="() => {scale = 1}"
  />
  <v-text
    v-if="labelWithoutLabel"
    :x="labelX"
    :y="labelY"
    :text="sector.objLabel.typeText + sector.objLabel.numText"
    :offset="{
      x: 20 * sizeMultiplier * scale * scaleMultiplier,
      y: 10 * sizeMultiplier * scale * scaleMultiplier,
    }"
    fontFamily='Times New Roman'
    :fontSize="22 * sizeMultiplier * scale * scaleMultiplier"
    :rotation="-(sector.sEnd - arcLength / 2) - 180 * r"
    :fontStyle="sector.objLabel.fontStyle"
    @click="handleClick"
    @mouseOver="() => {fill = 'gray'}"
    @mouseOut="() => {fill = bgColor}"
  />
</template>

<style scoped>

</style>
