<script setup lang="ts">
import { computed, ref } from 'vue'
import { useParamStore } from '../store/paramStore'
import { useClickedStore } from '../store/clickedStore'
import { controlPoint } from '../helpers/controlPoint'
import type { Sector } from '../types/sector'

const store = useParamStore()
const clickedStore = useClickedStore()

const props = defineProps({
  sector: {
    type: Object as () => Sector,
    required: true
  },
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
    clickedStore.clickedInfo.value = {
      type: 'sector',
      object: props.sector,
    }
    clickedStore.isClickedSector.value = true
    clickedStore.clickedSector.value = props.sector
}

let additional = 0
if (store.showSupportRect.value) {
  additional = 50
}

const [labelX, labelY] = controlPoint(store.params.value.labelRadius + 50 * props.sector.sLevel * store.scaleMultiplier.value, 90 + (props.sector.sEnd - arcLength / 2))
const [nameX, nameY] = controlPoint(store.params.value.sectorNameRadius + additional, 90 + (props.sector.sEnd - arcLength / 2))

let fillColor = 'white'
if (props.sector.object) {
  if (props.sector.object.score > 0) {
    fillColor = 'green'
  }
  if (props.sector.object.score < 0) {
    fillColor = 'red'
  }
}

const labelWithLabel = computed(() => {
  if (props.sector.object && props.sector.object.isLabel)
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
    v-if="labelWithLabel && sector.object.level != 0"
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
    v-if="labelWithLabel && store.showScore.value  && sector.object.level != 0"
    :x="labelX"
    :y="labelY"
    :width="36 * coeff"
    :height="36 * coeff"
    :opacity="Math.abs(sector.object.score)"
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
    v-if="labelWithLabel && sector.object.level != 0"
    :x="labelX"
    :y="labelY"
    :text="sector.object.typeText"
    :offset="{
      x: 13 * coeff,
      y: 10 * coeff,
    }"
    fontFamily='Times New Roman'
    :fontSize= "22 * coeff"
    :fontStyle="sector.object.fontStyle"
    @click="handleClick"
    @mouseOver="() => {scale = 1.5}"
    @mouseOut="() => {scale = 1}"
  />
  <v-text
    v-if="labelWithLabel && sector.object.level != 0"
    :x="labelX"
    :y="labelY"
    :text="sector.object.numText"
    :offset="{
      x: 1 * coeff,
      y: 2 * coeff,
    }"
    fontFamily='Times New Roman'
    :fontSize="16 * coeff"
    :fontStyle="sector.object.fontStyle"
    @click="handleClick"
    @mouseOver="() => {scale = 1.5}"
    @mouseOut="() => {scale = 1}"
  />
  <v-text
    v-if="!labelWithLabel  && sector.object.level != 0"
    :x="labelX"
    :y="labelY"
    :text="sector.object.typeText + sector.object.numText"
    :offset="{
      x: 20 * coeff,
      y: 10 * coeff,
    }"
    fontFamily='Times New Roman'
    :fontSize="22 * coeff"
    :rotation="-(sector.sEnd - arcLength / 2) - 180 * r"
    :fontStyle="sector.object.fontStyle"
    @click="handleClick"
    @mouseOver="() => {fill = 'gray'}"
    @mouseOut="() => {fill = bgColor}"
  />
</template>

<style scoped>

</style>
