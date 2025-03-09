<script setup>
import { computed, ref } from 'vue';
import { useParamStore } from '../store/paramStore';

const store = useParamStore()

const props = defineProps({
  labelX: Number,
  labelY: Number,
  supLabelX: Number,
  supLabelY: Number,
  supLabelX2: Number,
  supLabelY2: Number,
  supLabelX3: Number,
  supLabelY3: Number,
  angles: Object,
  objLabel: Object,
})

const emit = defineEmits(['setActionItem'])

const setActionItem = () => {}

const scale = ref(1)

const handleClick = () => {
  scale.value = 1
}

const handleMouseOver = () => {
  scale.value = 1.5
  setActionItem({
    type: 'SupportOnMouseOver',
    objLabel: props.objLabel,
  })
}

const handleMouseOut = () => {
  scale.value = 1
  setActionItem(null)
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
.read-the-docs {
  color: #888;
}
</style>
