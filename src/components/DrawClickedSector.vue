<script setup>
import DrawSector from './DrawSector.vue';
import { useClickedStore } from '../store/clickedStore';

const clickedStore = useClickedStore()

</script>

<template>
  <DrawSector
    :sector="clickedStore.clickedSector.value.sector"
    bgColor='gray'
    :opacity=0.5
  />
</template>

<style scoped>

</style>
