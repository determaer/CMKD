<script setup>
import DrawAngledLine from './DrawAngledLine.vue';

const props = defineProps({
  x: Number,
  y: Number,
  startRadius: Number,
  endRadius: Number,
  angle: Number,
  scaleMultiplier: Number,
})

</script>

<template>
  <DrawAngledLine
    :x="x"
    :y="y"
    :startRadius="startRadius"
    :endRadius="endRadius"
    :angle="angle"
    color='black'
    :width="5 * scaleMultiplier"
  />
  <DrawAngledLine
    :x="x"
    :y="y"
    :startRadius="startRadius - 2"
    :endRadius="endRadius + 2"
    :angle="angle"
    color='white'
    :width="2 * scaleMultiplier"
  />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
