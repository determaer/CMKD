<script setup lang="ts">
import { calcControlPoint } from "../helpers/calcControlPoint";
import { useParamStore } from "../store/paramStore";

const { reloadCount, centerPoint } = useParamStore();

const props = defineProps<{
  startRadius: number;
  endRadius: number;
  angle: number;
  color: string;
  width: number;
}>();

const [startX, startY] = calcControlPoint(
  centerPoint.value,
  props.startRadius,
  props.angle,
);
const [endX, endY] = calcControlPoint(
  centerPoint.value,
  props.endRadius,
  props.angle,
);
</script>

<template>
  <v-line
    :key="`${reloadCount}-angled-line`"
    :points="[startX, startY, endX, endY]"
    :stroke="color"
    :strokeWidth="width"
  />
</template>

<style scoped></style>
