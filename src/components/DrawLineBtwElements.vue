<script setup>
import { controlPoint } from '../helpers/controlPoint'
import { ref, computed, onMounted } from 'vue'
const props = defineProps({
  x: Number,
  y: Number,
  params: Object,
  objLabelOut: Object,
  objLabelIn: Object,
  scaleMultiplier: Number,
  flags: Object,
  discNum: Number,
  position: Number,
})

const emit = defineEmits(['setClickedLine', 'setClickedElement', 'setActionItem', 'setClickedInfo'])

const scale = ref(1)

const points = ref()

const dash = computed(() => {
  if ((props.objLabelIn.prop !== 0 || props.objLabelOut.prop !== 0) && !props.flags.oneLevel) return [5, 2]
})

const stroke = computed(() => {
  if (props.flags.showImportant) {
    if (props.objLabelOut.score < 0 || (props.objLabelIn.score < 0 && props.objLabelOut.isBase)) {
      return 'red'
    }
  }
  return 'black'
})

const draw = computed(() => {
  if (props.position && props.objLabelIn.index > props.position) 
    return false
  return true
})

onMounted(() => {
  let radiusCorrection = 0
  if (props.discNum >= 50) radiusCorrection = 1
  let bezierCPangle1, bezierCPangle2
  let outAngle, inAngle, outRadius, inRadius
  
  if (props.objLabelIn.prop !== 0 || props.objLabelOut.prop !== 0) {
    inRadius = props.params.innerRadius
    outRadius = props.params.linesBtwElementsRadius
    outAngle = props.params.angles.find((lAngle) => lAngle.labelId === props.objLabelOut.index).inAngle
    inAngle = props.params.angles.find((lAngle) => lAngle.labelId === props.objLabelIn.index).outAngle
  } 
  else {
    outRadius = props.params.innerRadius
    inRadius = props.params.linesBtwElementsRadius
    outAngle = props.params.angles.find((lAngle) => lAngle.labelId === props.objLabelOut.index).outAngle
    inAngle = props.params.angles.find((lAngle) => lAngle.labelId === props.objLabelIn.index).inAngle
  }

  let diff = Math.abs(outAngle - inAngle)
  if (outAngle >= 300) outAngle = outAngle - 360
  if (inAngle >= 300) inAngle = inAngle - 360
  let radius
  if (diff < 180) {
    let t = (180 - diff) / 10
    diff = diff / 250
    radius = 10 * t * props.scaleMultiplier + 50 * radiusCorrection * props.scaleMultiplier
    bezierCPangle1 = outAngle + diff
    bezierCPangle2 = inAngle - diff
  }
  if (diff >= 180) {
    let t = (180 - Math.abs(diff - 360)) / 10
    diff = diff / 250
    radius = 10 * t * props.scaleMultiplier + 50 * radiusCorrection * props.scaleMultiplier
    bezierCPangle1 = outAngle - diff
    bezierCPangle2 = inAngle + diff
  }

  const [bezierCPX1, bezierCPY1] = controlPoint(props.x, props.y, radius, bezierCPangle1)
  const [bezierCPX2, bezierCPY2] = controlPoint(props.x, props.y, radius, bezierCPangle2)
  const [outX, outY] = controlPoint(props.x, props.y, outRadius, outAngle)
  const [inX, inY] = controlPoint(props.x, props.y, inRadius, inAngle)
  points.value = [outX, outY, bezierCPX1, bezierCPY1, bezierCPX2, bezierCPY2, inX, inY]
})
    
const handleClick = () => {
  scale.value = 1
  emit('setClickedElement', {isClicked: false})
  emit('setClickedLine',
  {
    isClicked: true,
    objLabelIn: props.objLabelIn,
    objLabelOut: props.objLabelOut,
  })
  emit('setActionItem', 
  {
    type: 'LineOnClick',
    objLabelIn: props.objLabelIn,
    objLabelOut: props.objLabelOut,
  })
  emit('setClickedInfo',
  {
    type: 'line',
    objLabelIn: props.objLabelIn,
    objLabelOut: props.objLabelOut,
  })
}

const handleMouseOver = () => {
  scale.value = 3
  emit('setActionItem', 
  {
    type: 'LineOnMouseOver',
    objLabelIn: props.objLabelIn,
    objLabelOut: props.objLabelOut,
  })
}

const handleMouseOut = () => {
  scale.value = 1
  emit('setActionItem', null)
}


</script>

<template>
  <v-line
    v-if="draw"
    :bezier="true"
    :points="points"
    :stroke="stroke"
    :strokeWidth="2.2 * scale * scaleMultiplier"
    :dash="dash"
    @click="handleClick"
    @mouseOver="handleMouseOver"
    @mouseOut="handleMouseOut"
  />
</template>

<style scoped>

</style>
