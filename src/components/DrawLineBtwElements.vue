<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useParamStore } from '../store/paramStore'
import { useClickedStore } from '../store/clickedStore'
import { controlPoint } from '../helpers/controlPoint'
import type { Label } from '../types'
const store = useParamStore()
const clickedStore = useClickedStore()

const props = defineProps({
  objLabelOut: {
    type: Object as () => Label,
    required: true
  },
  objLabelIn: {
    type: Object as () => Label,
    required: true
  },
})

const scale = ref(1)

const points = ref<Number[]>()

const dash = computed(() => {
  if ((props.objLabelIn.prop !== 0 || props.objLabelOut.prop !== 0) && !store.oneLevel.value) return [5, 2]
})

const stroke = computed(() => {
  if (store.showImportant.value) {
    if (props.objLabelOut.score < 0 || (props.objLabelIn.score < 0 && props.objLabelOut.isBase)) {
      return 'red'
    }
  }
  return 'black'
})

const draw = computed(() => {
  if (store.position.value && props.objLabelIn.index > store.position.value) 
    return false
  return true
})

onMounted(() => {
  let radiusCorrection = 0
  if (store.discNum.value >= 50) radiusCorrection = 1

  let bezierCPangle1 = 0, bezierCPangle2 = 0
  let outAngle: number, inAngle: number, outRadius: number, inRadius: number
  let radius = 0

  if (props.objLabelIn.prop !== 0 || props.objLabelOut.prop !== 0) {
    inRadius = store.params.value.innerRadius
    outRadius = store.params.value.linesBtwElementsRadius
    outAngle = store.params.value.angles.find((lAngle) => lAngle.labelId === props.objLabelOut.index)?.inAngle ?? 0
    inAngle = store.params.value.angles.find((lAngle) => lAngle.labelId === props.objLabelIn.index)?.outAngle ?? 0
  } 
  else {
    outRadius = store.params.value.innerRadius
    inRadius = store.params.value.linesBtwElementsRadius
    outAngle = store.params.value.angles.find((lAngle) => lAngle.labelId === props.objLabelOut.index)?.outAngle ?? 0
    inAngle = store.params.value.angles.find((lAngle) => lAngle.labelId === props.objLabelIn.index)?.inAngle ?? 0
  }

  let diff = Math.abs(outAngle - inAngle)
  if (outAngle >= 300) outAngle = outAngle - 360
  if (inAngle >= 300) inAngle = inAngle - 360
  
  if (diff < 180) {
    let t = (180 - diff) / 10
    diff = diff / 250
    radius = 10 * t * store.scaleMultiplier.value + 50 * radiusCorrection * store.scaleMultiplier.value
    bezierCPangle1 = outAngle + diff
    bezierCPangle2 = inAngle - diff
  }
  if (diff >= 180) {
    let t = (180 - Math.abs(diff - 360)) / 10
    diff = diff / 250
    radius = 10 * t * store.scaleMultiplier.value + 50 * radiusCorrection * store.scaleMultiplier.value
    bezierCPangle1 = outAngle - diff
    bezierCPangle2 = inAngle + diff
  }
  

  const [bezierCPX1, bezierCPY1] = controlPoint(radius, bezierCPangle1)
  const [bezierCPX2, bezierCPY2] = controlPoint(radius, bezierCPangle2)
  const [outX, outY] = controlPoint(outRadius, outAngle)
  const [inX, inY] = controlPoint(inRadius, inAngle)
  points.value = [outX, outY, bezierCPX1, bezierCPY1, bezierCPX2, bezierCPY2, inX, inY]
})
    
const handleClick = () => {
  scale.value = 1
  clickedStore.resetClicked()
  nextTick(() => {
    clickedStore.isClickedLine.value = true
    clickedStore.clickedLine.value = {
      objLabelIn: props.objLabelIn,
      objLabelOut: props.objLabelOut,
    }
    clickedStore.clickedInfo.value = {
      type: 'line',
      object: {
        objLabelIn: props.objLabelIn,
        objLabelOut: props.objLabelOut,
      }
      
    }
  })
}

const handleMouseOver = () => {
  scale.value = 3
}

const handleMouseOut = () => {
  scale.value = 1
}


</script>

<template>
  <v-line
    v-if="draw"
    :bezier="true"
    :points="points"
    :stroke="stroke"
    :strokeWidth="2.2 * scale * store.scaleMultiplier.value"
    :dash="dash"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
</template>

<style scoped>

</style>
