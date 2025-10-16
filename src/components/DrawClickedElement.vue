<script setup lang="ts">
import DrawLabels from './DrawLabels.vue'
import DrawLineBtwElements from './DrawLineBtwElements.vue'
import { useClickedStore } from '../store/clickedStore'
import type { Line } from '../types/line'
import type { Label } from '../types'

const clickedStore = useClickedStore()

const labels1: {label: Label, shadowed: boolean}[] = []
const lines : Line[] = []
if (clickedStore.clickedElement.value?.objLabel)
labels1.push({
  label: clickedStore.clickedElement.value?.objLabel,
  shadowed: true,
})

clickedStore.clickedElement.value?.nextLabels.map((nLabel) => {
  labels1.push({
    label: nLabel,
    shadowed: false,
  })
  if (clickedStore.clickedElement.value?.objLabel)
  lines.push({
    objLabelIn: clickedStore.clickedElement.value?.objLabel,
    objLabelOut: nLabel
  })
})
clickedStore.clickedElement.value?.prevLabels.map((pLabel) => {
  labels1.push({
    label: pLabel,
    shadowed: false
  })
  if (clickedStore.clickedElement.value?.objLabel)
  lines.push({
    objLabelIn: pLabel,
    objLabelOut: clickedStore.clickedElement.value?.objLabel,
  })
})

</script>

<template>
  <DrawLineBtwElements
    v-for="line of lines"
    :objLabelIn="line.objLabelIn"
    :objLabelOut="line.objLabelOut"
  />
  <DrawLabels
    v-for="label of labels1"
    :objLabel="label.label"
    :shadowed="label.shadowed"
  />
</template>

<style scoped>
</style>
