<script setup>
import { computed, nextTick, ref } from 'vue'
import { useParamStore } from '../store/paramStore'
import { useClickedStore } from '../store/clickedStore'
import { controlPoint } from '../helpers/controlPoint'
import DrawSupportLabel from './DrawSupportLabel.vue'

const store = useParamStore()
const clickedStore = useClickedStore()

const props = defineProps({
  objLabel: Object,
  shadowed: Boolean,
})

const lAngle = store.params.value.angles.find(
  (lAngle) => lAngle.labelId === props.objLabel.index
)

const scale = ref(1)
const [labelX, labelY] = controlPoint(store.x.value, store.y.value, store.params.value.labelRadius, lAngle.labelAngle)
const [inInnerX, inInnerY] = controlPoint(store.x.value, store.y.value,store.params.value.innerRadius, lAngle.inAngle)
const [outInnerX, outInnerY] = controlPoint(store.x.value, store.y.value, store.params.value.innerRadius, lAngle.outAngle)
const [outMergingX, outMergingY] = controlPoint(store.x.value, store.y.value, store.params.value.mergingPortsRadius, lAngle.outAngle)
const [inMergingX, inMergingY] = controlPoint(store.x.value, store.y.value, store.params.value.mergingPortsRadius, lAngle.inAngle)
const [arrowX, arrowY] = controlPoint(store.x.value, store.y.value, store.params.value.innerRadius - 1, lAngle.inAngle)

const [labelX2, labelY2] = controlPoint(store.x.value, store.y.value, store.params.value.labelRadius + 2.5, lAngle.labelAngle + 0.6)
const [labelX3, labelY3] = controlPoint(store.x.value, store.y.value, store.params.value.labelRadius + 5, lAngle.labelAngle + 1.2)

const handleClick = () => {
  scale.value = 1
  let arrPrevLabels = []
  let arrNextLabels = []
  store.labelsZero.value.map((label) => {
    if (label.connections.length !== 0) {
      label.connections.map((connection) => {
        if (props.objLabel.id === connection) {
          arrPrevLabels.push(label)
        }
      })
    }
  })
  props.objLabel.connections.map((connection) => {
    let label = store.labelsZero.value.find((label) => label.id === connection)
    if (label) arrNextLabels.push(label)
  })
  clickedStore.resetClicked()
  nextTick(() => {
    clickedStore.clickedElement.value = {
      isClicked: true,
      objLabel: props.objLabel,
      prevLabels: arrNextLabels,
      nextLabels: arrPrevLabels,
    }
    clickedStore.clickedInfo.value = {
      type: 'label',
      object: props.objLabel,
      prevLabels: arrNextLabels,
      nextLabels: arrPrevLabels,
    }
    console.log(clickedStore.clickedInfo.value)
  })
}

const handleMouseOver = () => {
  scale.value = 1.5
}

const handleMouseOut = () => {
  scale.value = 1
}

const fillColor = computed(() => {
  if (store.showScore.value) {
    if (props.objLabel.index > store.position.value) 
      return 'yellow'
    if (props.objLabel.grey) {
      return 'lightgrey'
    } 
    else {
      if (props.objLabel.score > 0) {
        return 'green'
      } 
      else if (props.objLabel.score < 0) {
        return 'red'
      }
    }
  }
  return 'white'
})

const drawSupportLabel = computed(() => {
  if (store.showSupportRect.value && (props.objLabel.num > 1 || (!props.objLabel.isBase && !store.showAdditionalInCircle.value)))
    return true
  return false
})

const cornerRadius = computed(() => {
  if (props.objLabel.type === 'roundrect' && !store.defaultRect.value)
    return 7
  else 0
})

const coeff = computed(() => {
  return store.sizeMultiplier.value * scale.value * store.scaleMultiplier.value
})

const fill = computed(() => {
  if (props.objLabel.learnt)
    return 'white'
  else return fillColor.value
})

const drawRectLabel = computed(() => {
  if ((props.objLabel.type === 'rect' || props.objLabel.type === 'roundrect' || store.defaultRect.value) &&
    (store.showAdditionalInCircle.value || props.objLabel.isBase))
      return true
  else return false
})

const drawCircleLabel = computed(() => {
  if (props.objLabel.type === 'circle' && !store.defaultRect.value && (store.showAdditionalInCircle.value || props.objLabel.isBase))
    return true
  else return false
})

const drawDoubleLabel = computed(() => {
  if (props.objLabel.num > 1 && !store.showSupportRect.value && !store.showScore.value)
    return true
  else return false
})

const drawTripleLabel = computed(() => {
 if (props.objLabel.num > 2 && !store.showSupportRect.value && !store.showScore.value)
  return true
else return false
})

const drawTextLabel = computed(() => {
  if (store.showAdditionalInCircle.value || props.objLabel.isBase)
    return true
  else return false
})

</script>

<template>
  <v-line
    :points="[inInnerX,inInnerY,inMergingX,inMergingY,labelX,labelY,outMergingX,outMergingY,outInnerX,outInnerY]"
    stroke='black'
    :strokeWidth="2 * store.scaleMultiplier.value"
    lineJoin='round'
  />
  <v-arrow
    :points="[arrowX, arrowY, inInnerX, inInnerY]"
    stroke='black'
    fill='black'
    :pointerWidth="10 * store.sizeMultiplier.value * store.scaleMultiplier.value"
    :pointerLength="10 * store.scaleMultiplier.value"
  />
  <DrawSupportLabel
    v-if="drawSupportLabel"
    :angles="lAngle"
    :objLabel="objLabel"
  />
<!-- Rectangular Label -->  
  <v-rect
    v-if="drawTripleLabel && drawRectLabel"
    :x="labelX3"
    :y="labelY3"
    :width="36 * coeff"
    :height="36 * coeff"
    fill="white"
    stroke='black'
    :strokeWidth="1 * store.scaleMultiplier.value"
    :offset="{
      x: 18 * coeff,
      y: 18 * coeff,
    }"
    :rotation="-lAngle.labelAngle"
    :cornerRadius="cornerRadius"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-rect
    v-if="drawDoubleLabel && drawRectLabel"
    :x="labelX2"
    :y="labelY2"
    :width="36 * coeff"
    :height="36 * coeff"
    fill='white'
    stroke='black'
    :strokeWidth="1 * store.scaleMultiplier.value"
    :offset="{
      x:18 *coeff,
      y:18 *coeff,
    }"
    :rotation="-lAngle.labelAngle"
    :cornerRadius="cornerRadius"
    @сlick="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-rect
    v-if="drawRectLabel"
    :x="labelX"
    :y="labelY"
    :width="36 * coeff"
    :height= "36 * coeff"
    fill="white"
    stroke='black'
    :strokeWidth="1 * store.scaleMultiplier.value"
    :offset="{
      x:18 *coeff,
      y:18 *coeff,
    }"
    :rotation="-lAngle.labelAngle"
    :cornerRadius="cornerRadius"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-rect
    v-if="store.showScore.value && drawRectLabel"
    :x="labelX"
    :y="labelY"
    :width="36 *coeff"
    :height="36 *coeff"
    :opacity="fillColor === 'lightgrey' || shadowed || fillColor == 'yellow'
        ? 1
        : Math.abs(objLabel.score)
    "
    :fill="shadowed ? 'white' : fillColor"
    :stroke="shadowed ? fillColor : 'black'"
    :strokeWidth="1 * store.scaleMultiplier.value"
    :offset="{
      x:18 *coeff,
      y:18 *coeff,
    }"
    :rotation="-lAngle.labelAngle"
    :cornerRadius="cornerRadius"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
<!--Circular Label-->             
  <v-circle
    v-if="drawCircleLabel && drawTripleLabel"
    :x="labelX3"
    :y="labelY3"
    :radius="20 * coeff"
    fill="white"
    stroke='"black"'
    :strokeWidth="1 * store.scaleMultiplier.value"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-circle
    v-if="drawCircleLabel && drawDoubleLabel"
    :x="labelX2"
    :y="labelY2"
    :radius="20 *coeff"
    fill="white"
    stroke='black'
    :strokeWidth="1 * store.scaleMultiplier.value"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-circle
    v-if="drawCircleLabel"
    :x="labelX"
    :y="labelY"
    :radius="20 * coeff"
    fill="white"
    stroke='black'
    :strokeWidth="1 * store.scaleMultiplier.value"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-circle
    v-if="store.showScore.value && drawCircleLabel"
    :x="labelX"
    :y="labelY"
    :radius="20 *coeff"
    :fill="shadowed ? 'white' : fillColor"
    :stroke="shadowed ? fillColor : 'black'"
    :strokeWidth="1 * store.scaleMultiplier.value"
    :opacity="fillColor === 'lightgrey' || shadowed || fillColor == 'yellow'
        ? 1
        : Math.abs(objLabel.score)
    "
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
<!-- Text in label -->
  <v-text
    v-if="drawTextLabel"
    :x="labelX"
    :y="labelY"
    :text="objLabel.typeText"
    :offset="{
      x: 14 * coeff,
      y: 10 * coeff,
    }"
    fontFamily='Times New Roman'
    :fontSize=" objLabel.typeText.length === 1
        ? 22 * coeff
        : 15 * coeff
    "
    :fontStyle="objLabel.fontStyle"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-text
    v-if="drawTextLabel"
    :x="labelX"
    :y="labelY"
    :text="objLabel.numText"
    :offset="{
      x: 3 * coeff,
      y: 4 * coeff,
    }"
    fontFamily='Times New Roman'
    :fontSize="16 * coeff"
    :fontStyle="objLabel.fontStyle"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
</template>

<style scoped>

</style>
