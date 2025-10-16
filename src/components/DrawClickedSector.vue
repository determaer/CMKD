<script setup lang="ts">
import DrawSector from './DrawSector.vue';
import { useClickedStore } from '../store/clickedStore';

const clickedStore = useClickedStore()

</script>

<template>
  <DrawSector
    v-if="clickedStore.clickedSector.value"
    :sector="clickedStore.clickedSector.value"
    bgColor='gray'
    :opacity=0.5
  />
</template>

<style scoped>

</style>
