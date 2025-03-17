<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useParamStore } from '../store/paramStore'
import { useClickedStore } from '../store/clickedStore'
import { controlPoint } from '../helpers/controlPoint'

const store = useParamStore()
const clickedStore = useClickedStore()

const props = defineProps({
  objLabelOut: Object,
  objLabelIn: Object,
})

const scale = ref(1)

const points = ref()

const dash = computed(() => {
  if ((props.objLabelIn.prop !== 0 || props.objLabelOut.prop !== 0) && !store.oneLevel) return [5, 2]
})

const stroke = computed(() => {
  if (store.showImportant) {
    if (props.objLabelOut.score < 0 || (props.objLabelIn.score < 0 && props.objLabelOut.isBase)) {
      return 'red'
    }
  }
  return 'black'
})

const draw = computed(() => {
  if (store.position && props.objLabelIn.index > store.position) 
    return false
  return true
})

onMounted(() => {
  let radiusCorrection = 0
  if (store.discNum >= 50) radiusCorrection = 1
  let bezierCPangle1, bezierCPangle2
  let outAngle, inAngle, outRadius, inRadius
  
  if (props.objLabelIn.prop !== 0 || props.objLabelOut.prop !== 0) {
    inRadius = store.params.innerRadius
    outRadius = store.params.linesBtwElementsRadius
    outAngle = store.params.angles.find((lAngle) => lAngle.labelId === props.objLabelOut.index).inAngle
    inAngle = store.params.angles.find((lAngle) => lAngle.labelId === props.objLabelIn.index).outAngle
  } 
  else {
    outRadius = store.params.innerRadius
    inRadius = store.params.linesBtwElementsRadius
    outAngle = store.params.angles.find((lAngle) => lAngle.labelId === props.objLabelOut.index).outAngle
    inAngle = store.params.angles.find((lAngle) => lAngle.labelId === props.objLabelIn.index).inAngle
  }

  let diff = Math.abs(outAngle - inAngle)
  if (outAngle >= 300) outAngle = outAngle - 360
  if (inAngle >= 300) inAngle = inAngle - 360
  let radius
  if (diff < 180) {
    let t = (180 - diff) / 10
    diff = diff / 250
    radius = 10 * t * store.scaleMultiplier + 50 * radiusCorrection * store.scaleMultiplier
    bezierCPangle1 = outAngle + diff
    bezierCPangle2 = inAngle - diff
  }
  if (diff >= 180) {
    let t = (180 - Math.abs(diff - 360)) / 10
    diff = diff / 250
    radius = 10 * t * store.scaleMultiplier + 50 * radiusCorrection * store.scaleMultiplier
    bezierCPangle1 = outAngle - diff
    bezierCPangle2 = inAngle + diff
  }

  const [bezierCPX1, bezierCPY1] = controlPoint(store.x, store.y, radius, bezierCPangle1)
  const [bezierCPX2, bezierCPY2] = controlPoint(store.x, store.y, radius, bezierCPangle2)
  const [outX, outY] = controlPoint(store.x, store.y, outRadius, outAngle)
  const [inX, inY] = controlPoint(store.x, store.y, inRadius, inAngle)
  points.value = [outX, outY, bezierCPX1, bezierCPY1, bezierCPX2, bezierCPY2, inX, inY]
})
    
const handleClick = () => {
  scale.value = 1
  clickedStore.resetClicked()
  nextTick(() => {
    clickedStore.clickedLine = {
      isClicked: true,
      objLabelIn: props.objLabelIn,
      objLabelOut: props.objLabelOut,
    }
    clickedStore.actionItem = {
      type: 'LineOnClick',
      objLabelIn: props.objLabelIn,
      objLabelOut: props.objLabelOut,
    }
    clickedStore.clickedInfo = {
      type: 'line',
      objLabelIn: props.objLabelIn,
      objLabelOut: props.objLabelOut,
    }
  })
}

const handleMouseOver = () => {
  scale.value = 3
  clickedStore.actionItem = {
    type: 'LineOnMouseOver',
    objLabelIn: props.objLabelIn,
    objLabelOut: props.objLabelOut,
  }
}

const handleMouseOut = () => {
  scale.value = 1
  clickedStore.actionItem = null
}


</script>

<template>
  <v-line
    v-if="draw"
    :bezier="true"
    :points="points"
    :stroke="stroke"
    :strokeWidth="2.2 * scale * store.scaleMultiplier"
    :dash="dash"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
</template>

<style scoped>

</style>
