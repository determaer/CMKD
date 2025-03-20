<script setup>
import { computed, ref } from 'vue';
import { controlPoint } from '../helpers/controlPoint';
import { useParamStore } from '../store/paramStore';
import { useClickedStore } from '../store/clickedStore';

const store = useParamStore()
const clickedStore = useClickedStore()

const props = defineProps({
  angles: Object,
  objLabel: Object,
})

const [labelX, labelY] = controlPoint(store.x, store.y, store.params.labelRadius, props.angles.labelAngle)
const [supLabelX, supLabelY] = controlPoint(store.x, store.y, store.params.additionalLabelRadius, props.angles.labelAngle)

const [supLabelX2, supLabelY2] = controlPoint(store.x, store.y, store.params.additionalLabelRadius + 2.5, props.angles.labelAngle + 0.6)
const [supLabelX3, supLabelY3] = controlPoint(store.x, store.y, store.params.additionalLabelRadius + 5, props.angles.labelAngle + 1.2)

const scale = ref(1)

const handleClick = () => {
  scale.value = 1
  clickedStore.clickedInfo.value = {
    type: 'supportLabel',
    object: props.objLabel,
  }
}

const handleMouseOver = () => {
  scale.value = 1.5
}

const handleMouseOut = () => {
  scale.value = 1
}

const drawDoubleLabel = computed(() => {
  if (props.objLabel.num > 2 || (props.objLabel.num > 1 && !props.objLabel.isBase && !store.showAdditionalInCircle))
    return true
  else return false
})

const drawTripleLabel = computed(() => {
  if (props.objLabel.num > 3 || (props.objLabel.num > 2 && !props.objLabel.isBase && !store.showAdditionalInCircle))
    return true
  return false
})

const coeff = computed(() => {
  return store.sizeMultiplier * scale.value * store.scaleMultiplier
})

</script>

<template>
  <v-line
    :points="[labelX, labelY, supLabelX, supLabelY]"
    stroke='black'
  />
  <v-rect
    v-if="drawTripleLabel"
    :x="supLabelX3"
    :y="supLabelY3"
    :width="36 * coeff"
    :height="36 * coeff"
    fill='white'
    stroke='black'
    :strokeWidth="1 * store.scaleMultiplier"
    :offset="{
      x: 18 * coeff,
      y: 18 * coeff,
    }"
    :rotation="-angles.labelAngle"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-rect
    v-if="drawDoubleLabel"
    :x="supLabelX2"
    :y="supLabelY2"
    :width="36 * coeff"
    :height="36 * coeff"
    fill='white'
    stroke='black'
    :strokeWidth="1 * store.scaleMultiplier"
    :offset="{
      x: 18 * coeff,
      y: 18 * coeff,
    }"
    :rotation="-angles.labelAngle"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-rect
    :x="supLabelX"
    :y="supLabelY"
    :width="36 * coeff"
    :height="36 * coeff"
    fill='white'
    stroke='black'
    :strokeWidth="1 * store.scaleMultiplier"
    :offset="{
      x: 18 * coeff,
      y: 18 * coeff,
    }"
    :rotation="-angles.labelAngle"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-text
    :x="supLabelX"
    :y="supLabelY"
    :text="objLabel.typeText"
    :offset="{
      x: 13 * coeff,
      y: 10 * coeff,
    }"
    fontFamily='Times New Roman'
    :fontSize="22 * coeff"
    :fontStyle="objLabel.fontStyle"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-text
    :x="supLabelX"
    :y="supLabelY"
    :text="objLabel.numText"
    :offset="{
      x: 1 * coeff,
      y: 2 * coeff,
    }"
    fontFamily="'Times New Roman'"
    :fontSize="16 * coeff"
    :fontStyle="objLabel.fontStyle"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
</template>

<style scoped>
</style>
