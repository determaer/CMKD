<script setup>
import { ref } from 'vue'
import { useParamStore } from '../store/paramStore'
import { controlPoint } from '../helpers/controlPoint'

const store = useParamStore()

const props = defineProps({
  labels: Array,
})
    
const arrowsInLabels = ref([])
const arcBtwLabels = ref([])

props.labels.map((label, index) => {
  if (label.arrowIn) {
    let lAngle = store.params.angles.find(
      (lAngle) => lAngle.labelId === label.index
    )
    let startAngle = lAngle.arrowAngle - 1
    let endAngle = lAngle.arrowAngle
    let [startX, startY] = controlPoint(store.x,store.y, store.params.labelRadius,startAngle)
    let [endX, endY] = controlPoint(store.x, store.y, store.params.labelRadius, endAngle)
    if (store.showAdditionalInCircle || label.isBase)
      arrowsInLabels.value.push({
        startX: startX,
        startY: startY, 
        endX: endX, 
        endY: endY,
      })
  }
  if (label.arrowOut) {
    let startAngle = store.params.angles.find(
      (lAngle) => lAngle.labelId === label.index
    ).labelAngle

    let endAngle = store.params.angles.find(
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
    :pointerWidth="7 * store.sizeMultiplier * store.scaleMultiplier"
    :pointerLength="7 * store.scaleMultiplier"
  />
  <v-arc
    v-if="arcBtwLabels.length > 0"
    v-for="a of arcBtwLabels"
    :x="store.x"
    :y="store.y"
    stroke='black'
    :angle="a.angle"
    :innerRadius="store.params.labelRadius"
    :outerRadius="store.params.labelRadius"
    :clockwise="true"
    :rotation="a.rotation"
    :strokeWidth="2 * store.scaleMultiplier"
  />
</template>

<style scoped>

</style>
