<script setup>

import { ref } from 'vue'
import { controlPoint } from '../helpers/controlPoint'

const props = defineProps({
  labels: Array,
  x: Number,
  y: Number,
  params: Object,
  sizeMultiplier: Number,
  scaleMultiplier: Number,
  flags: Object,
})
    
const arrowsInLabels = ref([])
const arcBtwLabels = ref([])

props.labels.map((label, index) => {
  if (label.arrowIn) {
    let lAngle = props.params.angles.find(
      (lAngle) => lAngle.labelId === label.index
    )
    let startAngle = lAngle.arrowAngle - 1
    let endAngle = lAngle.arrowAngle
    let [startX, startY] = controlPoint(props.x,props.y, props.params.labelRadius,startAngle)
    let [endX, endY] = controlPoint(props.x, props.y, props.params.labelRadius, endAngle)
    if (props.flags.showAdditionalInCircle || label.isBase)
      arrowsInLabels.value.push({
        startX: startX,
        startY: startY, 
        endX: endX, 
        endY: endY,
      })
  }
  if (label.arrowOut) {
    let startAngle = props.params.angles.find(
      (lAngle) => lAngle.labelId === label.index
    ).labelAngle

    let endAngle = props.params.angles.find(
      (lAngle) => lAngle.labelId === props.labels[index + 1].index
    ).labelAngle

    arcBtwLabels.value.push({
      angle: startAngle - endAngle,
      rotation: -startAngle,
    })
  }
})
</script>

<template>
  <v-arrow
    v-if="arcBtwLabels.length > 0"
    v-for="a of arrowsInLabels"
    :points="[a.startX, a.startY, a.endX, a.endY]"
    stroke='black'
    fill='black'
    :pointerWidth="7 * sizeMultiplier * scaleMultiplier"
    :pointerLength="7 * scaleMultiplier"
  />
  <v-arc
    v-if="arcBtwLabels.length > 0"
    v-for="a of arcBtwLabels"
    :x="x"
    :y="y"
    stroke='black'
    :angle="a.angle"
    :innerRadius="params.labelRadius"
    :outerRadius="params.labelRadius"
    :clockwise="true"
    :rotation="a.rotation"
    :strokeWidth="2 * scaleMultiplier"
  />
</template>

<style scoped>

</style>
