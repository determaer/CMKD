<script setup>

import { controlPoint } from '../helpers/controlPoint';

const props = defineProps({
  x: Number,
  y: Number,
  startRadius: Number,
  endRadius: Number,
  angle: Number,
  color: String,
  width: Number,
})
    
const [startX, startY] = controlPoint(props.x, props.y, props.startRadius, props.angle)
const [endX, endY] = controlPoint(props.x, props.y, props.endRadius, props.angle)

</script>

<template>
  <v-line
    :points="[startX, startY, endX, endY]"
    :stroke="color"
    :strokeWidth="width"
  />
</template>

<style scoped>
</style>
