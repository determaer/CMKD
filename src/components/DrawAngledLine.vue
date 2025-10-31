<script setup lang="ts">
import { controlPoint } from "../helpers/controlPoint";

const props = defineProps<{
  startRadius: number;
  endRadius: number;
  angle: number;
  color: string;
  width: number;
}>();

const [startX, startY] = controlPoint(props.startRadius, props.angle);
const [endX, endY] = controlPoint(props.endRadius, props.angle);
</script>

<template>
  <v-line
    :points="[startX, startY, endX, endY]"
    :stroke="color"
    :strokeWidth="width"
  />
</template>

<style scoped></style>
