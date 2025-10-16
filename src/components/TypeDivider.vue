<script setup lang="ts">
import { useParamStore } from '../store/paramStore';
import DrawAngledLine from './DrawAngledLine.vue';

const store = useParamStore()

defineProps({
  startRadius: {type: Number, required: true},
  endRadius: {type: Number, required: true},
  angle: {type: Number, required: true},
})

</script>

<template>
  <DrawAngledLine
    :startRadius="startRadius"
    :endRadius="endRadius"
    :angle="angle"
    color='black'
    :width="5 * store.scaleMultiplier.value"
  />
  <DrawAngledLine
    :startRadius="startRadius - 2"
    :endRadius="endRadius + 2"
    :angle="angle"
    color='white'
    :width="2 * store.scaleMultiplier.value"
  />
</template>

<style scoped>
</style>
