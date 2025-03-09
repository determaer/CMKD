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
  angles: Array,
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
    objLabel: objLabel,
  })
}

const handleMouseOut = () => {
  scale.value = 1
  setActionItem(null)
}

const drawDoubleLabel = computed(() => {
  if (objLabel.num > 2 || (objLabel.num > 1 && !objLabel.isBase && !flags.showAdditionalInCircle))
    return true
  else return false
})

const drawTripleLabel = computed(() => {
  if (objLabel.num > 3 || (objLabel.num > 2 && !objLabel.isBase && !flags.showAdditionalInCircle))
    return true
  return false
})

const coeff = computed(() => {
  return store.sizeMultiplier * scale.value * store.scaleMultiplier
})

</script>

<template>
  <Canvas.Line
    :points="[labelX, labelY, supLabelX, supLabelY]"
    stroke='black'
  />
  <Canvas.Rect
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
  <Canvas.Rect
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
  <Canvas.Rect
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
  <Canvas.Text
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
  <Canvas.Text
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
