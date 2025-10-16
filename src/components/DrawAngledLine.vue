<script setup lang="ts">
import { controlPoint } from '../helpers/controlPoint';

const props = defineProps({
  startRadius: {type: Number, required: true},
  endRadius: {type: Number, required: true},
  angle: {type: Number, required: true},
  color: String,
  width: Number,
})
    
const [startX, startY] = controlPoint(props.startRadius, props.angle)
const [endX, endY] = controlPoint(props.endRadius, props.angle)

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
