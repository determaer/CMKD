<script setup>
import { ref } from 'vue'
import { useParamStore } from '../store/paramStore'
import { controlPoint } from '../helpers/controlPoint'

const store = useParamStore()
    
const arrowsInLabels = ref([])
const arcBtwLabels = ref([])

store.labelsZero.value.map((label, index) => {
  if (label.arrowIn) {
    let lAngle = store.params.value.angles.find(
      (lAngle) => lAngle.labelId === label.index
    )
    let startAngle = lAngle.arrowAngle - 1
    let endAngle = lAngle.arrowAngle
    let [startX, startY] = controlPoint(store.x.value,store.y.value, store.params.value.labelRadius,startAngle)
    let [endX, endY] = controlPoint(store.x.value, store.y.value, store.params.value.labelRadius, endAngle)
    if (store.showAdditionalInCircle.value || label.isBase)
      arrowsInLabels.value.push({
        startX: startX,
        startY: startY, 
        endX: endX, 
        endY: endY,
      })
  }
  if (label.arrowOut) {
    let startAngle = store.params.value.angles.find(
      (lAngle) => lAngle.labelId === label.index
    ).labelAngle

    let endAngle = store.params.value.angles.find(
      (lAngle) => lAngle.labelId === store.labelsZero.value[index + 1].index
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
    :pointerWidth="7 * store.sizeMultiplier.value * store.scaleMultiplier.value"
    :pointerLength="7 * store.scaleMultiplier.value"
  />
  <v-arc
    v-if="arcBtwLabels.length > 0"
    v-for="a of arcBtwLabels"
    :x="store.x.value"
    :y="store.y.value"
    stroke='black'
    :angle="a.angle"
    :innerRadius="store.params.value.labelRadius"
    :outerRadius="store.params.value.labelRadius"
    :clockwise="true"
    :rotation="a.rotation"
    :strokeWidth="2 * store.scaleMultiplier.value"
  />
</template>

<style scoped>

</style>
