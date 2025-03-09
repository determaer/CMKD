<script setup>
import { useParamStore } from '../store/paramStore';
import DrawAngledLine from './DrawAngledLine.vue';

const store = useParamStore()

const props = defineProps({
  startRadius: Number,
  endRadius: Number,
  angle: Number,
})

</script>

<template>
  <DrawAngledLine
    :startRadius="startRadius"
    :endRadius="endRadius"
    :angle="angle"
    color='black'
    :width="5 * store.scaleMultiplier"
  />
  <DrawAngledLine
    :startRadius="startRadius - 2"
    :endRadius="endRadius + 2"
    :angle="angle"
    color='white'
    :width="2 * store.scaleMultiplier"
  />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
