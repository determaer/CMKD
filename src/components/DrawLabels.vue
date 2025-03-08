<script setup>
import { computed, ref } from 'vue'
import { controlPoint } from '../helpers/controlPoint'
import DrawSupportLabel from './DrawSupportLabel.vue'
const props = defineProps({
  x: Number,
  y: Number,
  params: Object,
  objLabel: Object,
  flags: Object,
  sizeMultiplier: Number,
  scaleMultiplier: Number,
  labels: Array,
  shadowed: Boolean,
  position: Number,
})

const emit = defineEmits(["setClickedElement", "setClickedLine", "setActionItem", "setClickedInfo"])

const setClickedInfo = () => {}

const setActionItem = () => {}

const setClickedElement = () => {}

const setClickedLine = () => {}

let lAngle = props.params.angles.find(
  (lAngle) => lAngle.labelId === props.objLabel.index
)

const scale = ref(1)
const [labelX, labelY] = controlPoint(props.x, props.y, props.params.labelRadius, lAngle.labelAngle)
const [inInnerX, inInnerY] = controlPoint(props.x, props.y,props.params.innerRadius, lAngle.inAngle)
const [outInnerX, outInnerY] = controlPoint(props.x, props.y, props.params.innerRadius, lAngle.outAngle)
const [outMergingX, outMergingY] = controlPoint(props.x, props.y, props.params.mergingPortsRadius, lAngle.outAngle)
const [inMergingX, inMergingY] = controlPoint(props.x, props.y, props.params.mergingPortsRadius, lAngle.inAngle)
const [supLabelX, supLabelY] = controlPoint(props.x, props.y, props.params.additionalLabelRadius, lAngle.labelAngle)
const [arrowX, arrowY] = controlPoint(props.x, props.y, props.params.innerRadius - 1, lAngle.inAngle)

const [labelX2, labelY2] = controlPoint(props.x, props.y, props.params.labelRadius + 2.5, lAngle.labelAngle + 0.6)
const [labelX3, labelY3] = controlPoint(props.x, props.y, props.params.labelRadius + 5, lAngle.labelAngle + 1.2)
const [supLabelX2, supLabelY2] = controlPoint(props.x, props.y, props.params.additionalLabelRadius + 2.5, lAngle.labelAngle + 0.6)
const [supLabelX3, supLabelY3] = controlPoint( props.x, props.y, props.params.additionalLabelRadius + 5, lAngle.labelAngle + 1.2)

const handleClick = () => {
  setScale(1)
  let arrPrevLabels = []
  let arrNextLabels = []
  props.labels.map((label) => {
    if (label.connections.length !== 0) {
      label.connections.map((connection) => {
        if (props.objLabel.id === connection) {
          arrPrevLabels.push(label)
        }
      })
    }
  })
  props.objLabel.connections.map((connection) => {
    let label = props.labels.find((label) => label.id === connection)
    if (label != undefined) arrNextLabels.push(label)
  })
  setClickedLine({isClicked: false})
  setClickedElement({
    isClicked: true,
    objLabel: props.objLabel,
    prevLabels: arrNextLabels,
    nextLabels: arrPrevLabels,
  })
  setActionItem({
    type: 'LabelOnClick',
    objLabel: props.objLabel,
  })
  setClickedInfo({
    type: 'label',
    objLabel: props.objLabel,
    prevLabels: arrNextLabels,
    nextLabels: arrPrevLabels,
  })
}

const handleMouseOver = () => {
  scale.value = 1.5
  setActionItem({
    type: 'LabelOnMouseOver',
    objLabel: props.objLabel,
  })
}

const handleMouseOut = () => {
  scale.value = 1
  setActionItem(null)
}

const fillColor = computed(() => {
  if (props.flags.showScore) {
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
  if (props.objLabel.index > props.position) 
   return 'yellow'
  }
  return 'white'
})

const drawSupportLabel = computed(() => {
  if (props.flags.showSupportRect && (props.objLabel.num > 1 || (!props.objLabel.isBase && !props.flags.showAdditionalInCircle)))
    return true
  return false
})

const cornerRadius = computed(() => {
  if (props.objLabel.type === 'roundrect' && !props.flags.defaultRect)
    return 7
  else 0
})

const coeff = computed(() => {
  return props.sizeMultiplier * scale.value * props.scaleMultiplier
})

const fill = computed(() => {
  if (props.objLabel.learnt)
    return 'white'
  else return fillColor.value
})

const drawRectLabel = computed(() => {
  if ((props.objLabel.type === 'rect' || props.objLabel.type === 'roundrect' || props.flags.defaultRect) &&
    (props.flags.showAdditionalInCircle || props.objLabel.isBase))
      return true
  else return false
})

const drawCircleLabel = computed(() => {
  if (props.objLabel.type === 'circle' && !props.flags.defaultRect && (props.flags.showAdditionalInCircle || props.objLabel.isBase))
    return true
  else return false
})

const drawDoubleLabel = computed(() => {
  if (props.objLabel.num > 1 && !props.flags.showSupportRect && !props.flags.showScore)
    return true
  else return false
})

const drawTripleLabel = computed(() => {
 if (props.objLabel.num > 2 && !props.flags.showSupportRect && !props.flags.showScore)
  return true
else return false
})

const drawTextLabel = computed(() => {
  if (props.flags.showAdditionalInCircle || props.objLabel.isBase)
    return true
  else return false
})

</script>

<template>
  <v-line
    :points="[inInnerX,inInnerY,inMergingX,inMergingY,labelX,labelY,outMergingX,outMergingY,outInnerX,outInnerY]"
    stroke='black'
    :strokeWidth="2 * scaleMultiplier"
    lineJoin='round'
  />
  <v-arrow
    :points="[arrowX, arrowY, inInnerX, inInnerY]"
    stroke='black'
    fill='black'
    :pointerWidth="10 * sizeMultiplier * scaleMultiplier"
    :pointerLength="10 * scaleMultiplier"
  />
  <DrawSupportLabel
    v-if="drawSupportLabel"
    :labelX="labelX"
    :labelY="labelY"
    :supLabelX="supLabelX"
    :supLabelY="supLabelY"
    :supLabelX2="supLabelX2"
    :supLabelY2="supLabelY2"
    :supLabelX3="supLabelX3"
    :supLabelY3="supLabelY3"
    :sizeMultiplier="sizeMultiplier"
    :scaleMultiplier="scaleMultiplier"
    :angles="lAngle"
    :objLabel="objLabel"
    :flags="flags"
    @setActionItem="setActionItem"
  />
<!-- Rectangular Label -->  
  <v-rect
    v-if="drawTripleLabel && drawRectLabel"
    :x="labelX3"
    :y="labelY3"
    :width="36 * coeff"
    :height="36 * coeff"
    :fill="fill"
    stroke='black'
    :strokeWidth="1 * scaleMultiplier"
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
    :strokeWidth="1 * scaleMultiplier"
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
    :fill="fill"
    stroke='black'
    :strokeWidth="1 * scaleMultiplier"
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
    v-if="flags.showScore && drawRectLabel"
    :x="labelX"
    :y="labelY"
    :width="36 *coeff"
    :height="36 *coeff"
    :opacity="fillColor === 'lightgrey' || shadowed
        ? 1
        : Math.abs(objLabel.score)
    "
    :fill="shadowed ? 'white' : fillColor"
    :stroke="shadowed ? fillColor : 'black'"
    :strokeWidth="1 * scaleMultiplier"
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
    :fill="fill"
    stroke='"black"'
    :strokeWidth="1 * scaleMultiplier"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-circle
    v-if="drawCircleLabel && drawDoubleLabel"
    :x="labelX2"
    :y="labelY2"
    :radius="20 *coeff"
    :fill="fill"
    stroke='black'
    :strokeWidth="1 * scaleMultiplier"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-circle
    v-if="drawCircleLabel"
    :x="labelX"
    :y="labelY"
    :radius="20 * coeff"
    :fill="fill"
    stroke='black'
    :strokeWidth="1 * scaleMultiplier"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
  <v-circle
    v-if="flags.showScore && drawCircleLabel"
    :x="labelX"
    :y="labelY"
    :radius="20 *coeff"
    :fill="shadowed ? 'white' : fillColor"
    :stroke="shadowed ? fillColor : 'black'"
    :strokeWidth="1 * scaleMultiplier"
    :opacity="Math.abs(objLabel.score)"
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
