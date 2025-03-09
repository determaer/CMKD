<script setup>
import { useParamStore } from '../store/paramStore';
import { controlPoint } from '../helpers/controlPoint';

const store = useParamStore()

const props = defineProps({
  startRadius: Number,
  endRadius: Number,
  angle: Number,
  color: String,
  width: Number,
})
    
const [startX, startY] = controlPoint(store.x, store.y, props.startRadius, props.angle)
const [endX, endY] = controlPoint(store.x, store.y, props.endRadius, props.angle)

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
