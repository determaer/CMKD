<script setup>
import DrawLabels from './DrawLabels.vue'
import DrawLineBtwElements from './DrawLineBtwElements.vue'
import { useClickedStore } from '../store/clickedStore'

const clickedStore = useClickedStore()

const labels1 = []
const lines = []

labels1.push({
  label: clickedStore.clickedElement.value.objLabel,
  shadowed: true,
})

clickedStore.clickedElement.value.nextLabels.map((nLabel) => {
  labels1.push({
    label: nLabel,
    shadowed: false,
  })
  lines.push({
    objLabelIn: clickedStore.clickedElement.value.objLabel,
    objLabelOut: nLabel
  })
})
clickedStore.clickedElement.value.prevLabels.map((pLabel) => {
  labels1.push({
    label: pLabel,
    shadowed: false
  })
  lines.push({
    objLabelIn: pLabel,
    objLabelOut: clickedStore.clickedElement.value.objLabel,
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
