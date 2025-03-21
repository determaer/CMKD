<script setup>
import { computed, ref } from 'vue'
import { useParamStore } from '../store/paramStore'
import { useClickedStore } from '../store/clickedStore'
import { controlPoint } from '../helpers/controlPoint'

const store = useParamStore()
const clickedStore = useClickedStore()

const props = defineProps({
  sector: Object,
  bgColor: String,
  shadowed: Boolean,
  opacity: Number,
})

const fill = ref(props.bgColor)
const scale = ref(1)

let arcLength = props.sector.sEnd - props.sector.sStart
let r = 0
if (props.sector.sEnd - arcLength / 2 > 90 && props.sector.sEnd - arcLength / 2 < 270)
  r = 1

const handleClick = () => {
  if (store.oneLevel.value) {
    clickedStore.clickedInfo.value = {
      type: 'sector',
      object: props.sector,
    }
    clickedStore.clickedSector.value = {
      isClicked: true,
      sector: props.sector,
    }
  }
}

let additional = 0
if (store.showSupportRect.value) {
  additional = 50
}

const [labelX, labelY] = controlPoint(store.x.value, store.y.value, store.params.value.labelRadius + 50 * props.sector.sLevel * store.scaleMultiplier, 90 + (props.sector.sEnd - arcLength / 2))
const [nameX, nameY] = controlPoint(store.x.value, store.y.value, store.params.value.sectorNameRadius + additional, 90 + (props.sector.sEnd - arcLength / 2))

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

const coeff = computed(() => {
  return store.sizeMultiplier.value * scale.value * store.scaleMultiplier.value
})

</script>

<template>
  <v-arc
    :x="store.x.value"
    :y="store.y.value"
    :angle="360 - arcLength"
    :rotation="-90 - sector.sStart"
    :outerRadius="store.params.value.outerRadius + 50 * sector.sLevel * store.scaleMultiplier.value"
    :innerRadius="store.params.value.innerRadius + 50 * sector.sLevel * store.scaleMultiplier.value"
    :fill="fill"
    stroke='black'
    :opacity="opacity"
    :clockwise="true"
    :strokeWidth="2 * store.scaleMultiplier.value"
    @click="handleClick"
    @mouseOver="() => {fill = 'gray'}"
    @mouseOut="() => {fill = bgColor}"
  />
  <v-text
    v-if="store.showSectorName.value"
    :x="nameX"
    :y="nameY"
    :text="sector.shortname"
    :offset="{
      x: 20 * coeff,
      y: 10 * coeff,
    }"
    fontFamily='Times New Roman'
    :fontSize="22 * coeff"
    :rotation="-(sector.sEnd - arcLength / 2) - 180 * r"
    @click="handleClick"
    @mouseOver="() => {fill = 'gray'}"
    @mouseOut="() => {fill = bgColor}"
  />
  <v-rect
    v-if="labelWithLabel"
    :x="labelX"
    :y="labelY"
    :width="36 * coeff"
    :height= "36 * coeff"
    fill='white'
    stroke='black'
    :strokeWidth="1 * store.scaleMultiplier.value"
    :offset="{
      x: 18 * coeff,
      y: 18 * coeff,
    }"
    :rotation="-(sector.sEnd - arcLength / 2)"
    @click="handleClick"
    @mouseOver="() => {scale = 1.5}"
    @mouseOut="() => {scale = 1}"
  />
  <v-rect
    v-if="labelWithLabel && store.showScore.value"
    :x="labelX"
    :y="labelY"
    :width="36 * coeff"
    :height="36 * coeff"
    :opacity="Math.abs(sector.objLabel.score)"
    :fill="shadowed ? 'white' : fillColor"
    :stroke="shadowed ? fillColor : 'black'"
    :strokeWidth="1 * store.scaleMultiplier.value"
    :offset="{
      x: 18 * coeff,
      y: 18 * coeff,
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
      x: 13 * coeff,
      y: 10 * coeff,
    }"
    fontFamily='Times New Roman'
    :fontSize= "22 * coeff"
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
      x: 1 * coeff,
      y: 2 * coeff,
    }"
    fontFamily='Times New Roman'
    :fontSize="16 * coeff"
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
      x: 20 * coeff,
      y: 10 * coeff,
    }"
    fontFamily='Times New Roman'
    :fontSize="22 * coeff"
    :rotation="-(sector.sEnd - arcLength / 2) - 180 * r"
    :fontStyle="sector.objLabel.fontStyle"
    @click="handleClick"
    @mouseOver="() => {fill = 'gray'}"
    @mouseOut="() => {fill = bgColor}"
  />
</template>

<style scoped>

</style>
